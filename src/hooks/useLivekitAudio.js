import { RoomEvent, Track } from "livekit-client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { v4 } from "uuid";
import { livekitTokenApi } from "../api/audio";
import {
  getCleanMarkdownString,
  getErrorFromApi,
} from "../utils/helperFunction";
import { createRoom } from "../utils/livekit";
const useLivekitAudio = ({
  agentDetails,
  userDetails,
  setMessages,
  changeConversation,
  conversationId,
  startSession,
  endSession,
  handleChunkSpeak,
  enableAgentThinkingMode,
  disableAgentThinkingMode,
  hasAvatar,
}) => {
  const textEncoder = useMemo(() => {
    return new TextEncoder();
  }, []);

  const decoder = useMemo(() => {
    return new TextDecoder();
  }, []);

  const [room, setRoom] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [audioTracks, setAudioTracks] = useState({});
  const newConversationMessageAddedToChat = useRef(false);
  const [agentConnected, setAgentConnected] = useState(false);
  const [isMicrophoneEnabled, setIsMicrophoneEnabled] = useState(true);
  const [voiceConversationId, setVoiceConversationId] =
    useState(conversationId);

  const remoteAudioRefs = useRef({});

  useEffect(() => {
    if (!room) return;

    const localParticipant = room.localParticipant;

    // Handler to update the microphone state
    const handleMicrophoneStateChange = () => {
      setIsMicrophoneEnabled(localParticipant.isMicrophoneEnabled);
    };

    // Add event listeners
    localParticipant.on(RoomEvent.TrackMuted, handleMicrophoneStateChange);
    localParticipant.on(RoomEvent.TrackUnmuted, handleMicrophoneStateChange);

    return () => {
      // Cleanup event listeners when room or component unmounts
      localParticipant.off(RoomEvent.TrackMuted, handleMicrophoneStateChange);
      localParticipant.off(RoomEvent.TrackUnmuted, handleMicrophoneStateChange);
    };
  }, [room]);

  useEffect(() => {
    return () => {
      if (room) {
        room.disconnect();
      }
    };
  }, [room]);

  const handleDisconnect = useCallback(() => {
    if (room) {
      room.disconnect();
    }
  }, [room]);

  const interuptAgent = useCallback(() => {
    if (room) {
      const interuptMessage = textEncoder.encode("interupt_agent");
      room.localParticipant.publishData(interuptMessage, {
        topic: "agent_communication",
      });
    }
  }, [room, textEncoder]);

  // Mute or Unmute Local Participant
  const toggleMuteLocalParticipant = (isMuted) => {
    if (room) {
      const localParticipant = room.localParticipant;
      localParticipant.setMicrophoneEnabled(!isMuted);
    }
  };

  const connectToRoom = async () => {
    try {
      setStatus("connecting");
      setError(null);
      const payload = {
        agent_details: {
          agent_name: agentDetails?.agent_name,
          agent_id: agentDetails?.agent_id,
          version_id: agentDetails?.version_id,
          citations: agentDetails?.citations,
          tool_citations: agentDetails?.tool_citations,
          config: agentDetails?.config,
        },
        conversation_details: {
          conversation_id: voiceConversationId,
        },
        user_details: {
          name: userDetails?.name,
          id: userDetails?.id,
          guest_user: false,
        },
      };
      const livekitTokenResponse = await livekitTokenApi({ payload });
      if (livekitTokenResponse?.status === 200) {
        if (
          voiceConversationId !== livekitTokenResponse?.data?.conversation_id
        ) {
          setVoiceConversationId(livekitTokenResponse?.data?.conversation_id);
          changeConversation(livekitTokenResponse?.data?.conversation_id);
        }
        const newRoom = createRoom();

        newRoom
          .on(RoomEvent.Connected, () => {
            if (hasAvatar && startSession) startSession();
          })
          ?.on(RoomEvent.Disconnected, (reason) => {
            setStatus("idle");
            setAgentConnected(false);
            setParticipants([]);
            setAudioTracks({});
            setRoom(null);
            setIsMicrophoneEnabled(true);
            newConversationMessageAddedToChat.current = false;
            if (hasAvatar && endSession) endSession();
          })
          ?.on(RoomEvent.ConnectionQualityChanged, (quality, participant) => {})
          ?.on(RoomEvent.LocalAudioSilenceDetected, (publication) => {})
          ?.on(RoomEvent.LocalTrackSubscribed, (publication, participant) => {})
          ?.on(RoomEvent.TrackMuted, (publication, participant) => {})
          ?.on(RoomEvent.ActiveSpeakersChanged, (speakers) => {})
          ?.on(RoomEvent.ConnectionStateChanged, (state) => {})
          ?.on(RoomEvent.EncryptionError, (error) => {})
          ?.on(
            RoomEvent.ParticipantPermissionsChanged,
            (prevPermissions, participant) => {},
          )
          ?.on(RoomEvent.MediaDevicesError, (error) => {
            setError(getErrorFromApi(error));
            newRoom.disconnect();
          })
          ?.on(RoomEvent.DataReceived, (data, participant, kind, topic) => {
            const decodedData = decoder?.decode?.(data);
            const parsedTranscriptObject = JSON.parse(
              decodedData || JSON.stringify({}),
            );

            parsedTranscriptObject?.segments?.map((currentTranscript) => {
              const newTextObj = JSON.parse(
                currentTranscript?.text || JSON.stringify({}),
              );
              if (newTextObj?.role == "assistant" && !!newTextObj?.tool_calls) {
                setMessages((messages) => {
                  const latestMessage = messages[messages.length - 1];
                  const newTools =
                    newTextObj?.tool_calls
                      ?.map?.((toolData) => {
                        if (Object.keys(toolData || {})?.length > 0) {
                          const functionDetails = toolData?.function || {};
                          return {
                            ...(toolData || {}),
                            ...(functionDetails || {}),
                          };
                        } else {
                          return null;
                        }
                      })
                      ?.filter?.((toolData) => !!toolData) || null;
                  newConversationMessageAddedToChat.current = true;
                  if (latestMessage?.role === "SimplAi") {
                    return [
                      ...messages.slice(0, -1),
                      { ...latestMessage, tools: newTools },
                    ];
                  }
                  return [
                    ...messages,
                    {
                      role: "SimplAi",
                      content: "",
                      tools: newTools,
                      id: v4(),
                    },
                  ];
                });
              } else if (
                newTextObj?.role == "tool" &&
                !!newTextObj?.tool_call_id
              ) {
                setMessages((messages) => {
                  const latestMessage = messages[messages.length - 1];

                  if (latestMessage?.role === "SimplAi") {
                    const newToolwithDetails = latestMessage?.tools
                      ? latestMessage?.tools?.map?.((toolData) => {
                          if (toolData?.id === newTextObj?.tool_call_id) {
                            return {
                              ...toolData,
                              content: `${toolData?.content || ""}${
                                newTextObj?.content || ""
                              }`,
                            };
                          } else {
                            return { ...toolData };
                          }
                        })
                      : null;
                    return [
                      ...messages.slice(0, -1),
                      { ...latestMessage, tools: newToolwithDetails },
                    ];
                  }

                  return [...messages];
                });
              } else if (
                newTextObj?.role == "assistant" ||
                newTextObj?.role == "user"
              ) {
                if (
                  handleChunkSpeak &&
                  newTextObj?.role == "assistant" &&
                  newTextObj?.media_type === "avatar_voice"
                ) {
                  disableAgentThinkingMode();
                  handleChunkSpeak(getCleanMarkdownString(newTextObj?.content));
                  return null;
                } else {
                  enableAgentThinkingMode();
                }
                setMessages((messages) => {
                  const latestMessage = messages[messages.length - 1];

                  if (!!!newConversationMessageAddedToChat?.current) {
                    newConversationMessageAddedToChat.current = true;
                    return [
                      ...messages,
                      {
                        role: newTextObj?.role == "user" ? "user" : "SimplAi",
                        content: newTextObj?.content,
                        id: v4(),
                      },
                    ];
                  }
                  if (newTextObj?.role == "user") {
                    if (latestMessage?.role === "user") {
                      return [
                        ...messages.slice(0, -1),
                        {
                          ...latestMessage,
                          content: `${latestMessage?.content}${newTextObj?.content}`,
                        },
                      ];
                    } else {
                      return [
                        ...messages,
                        {
                          role: "user",
                          content: newTextObj?.content,
                          id: v4(),
                        },
                      ];
                    }
                  } else {
                    if (latestMessage?.role === "user") {
                      return [
                        ...messages,
                        {
                          role: "SimplAi",
                          content: newTextObj?.content,
                          id: v4(),
                        },
                      ];
                    } else {
                      return [
                        ...messages.slice(0, -1),
                        {
                          ...latestMessage,
                          content: `${latestMessage?.content}${newTextObj?.content}`,
                        },
                      ];
                    }
                  }
                });
              }
            });
          })
          ?.on(RoomEvent.SignalConnected, () => {})
          ?.on(RoomEvent.ParticipantConnected, (participant) => {
            if (participant?.isAgent) {
              setStatus("connected");
              setAgentConnected(true);
            }
            setParticipants((prev) => [...prev, participant]);

            // Subscribe to the participant's audio track
            // subscribeToAudioTrack(participant);
          })
          ?.on(RoomEvent.ParticipantDisconnected, (participant) => {
            if (participant?.isAgent) {
              setAgentConnected(false);
              newRoom.disconnect();
              return null;
            }
            setParticipants((prev) => prev.filter((p) => p !== participant));
            setAudioTracks((prev) => {
              const updatedTracks = { ...prev };
              delete updatedTracks[participant.identity];
              return updatedTracks;
            });
          })
          ?.on(RoomEvent.LocalTrackPublished, (publication, participant) => {
            // Add audio tracks of current user for visualization
            if (publication?.track?.kind === Track.Kind.Audio) {
              // Set the track for visualization
              setAudioTracks((prev) => ({
                ...prev,
                [participant.identity]: publication?.track || null, // Ensure no `undefined`
              }));
            }
          })
          ?.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
            // Ensure you update participants on any subscription changes
            if (track.kind === Track.Kind.Audio) {
              if (!hasAvatar && startSession && endSession) {
                const audioElement = new Audio();
                audioElement.srcObject = new MediaStream([
                  track.mediaStreamTrack,
                ]);
                audioElement.play();
                remoteAudioRefs.current[participant.identity] = audioElement;
              }

              // Set the track for visualization
              setAudioTracks((prev) => ({
                ...prev,
                [participant.identity]: track || null, // Ensure no `undefined`
              }));
            }
          })
          ?.on(RoomEvent.TrackUnsubscribed, (_, __, participant) => {
            if (remoteAudioRefs.current[participant.identity]) {
              remoteAudioRefs.current[participant.identity].pause();
              delete remoteAudioRefs.current[participant.identity];
            }
            setAudioTracks((prev) => ({
              ...prev,
              [participant.identity]: null, // Explicitly set null when unsubscribed
            }));
          })
          ?.on(
            RoomEvent.TranscriptionReceived,
            (transcription, participant, publication) => {},
          );

        await newRoom.connect(
          agentDetails?.socketEndpoint ??
            process.env.REACT_APP_AGENT_SOCKET_ENDPOINT,
          livekitTokenResponse?.data?.token,
          { autoSubscribe: true },
        );
        setRoom(newRoom);

        await newRoom.localParticipant.setMicrophoneEnabled(true);

        const allParticipants = [
          newRoom.localParticipant,
          ...Array.from(newRoom.remoteParticipants.values()),
        ];

        setParticipants(allParticipants);
      } else {
        setError(getErrorFromApi(livekitTokenResponse));
        setStatus("error");
      }
    } catch (error) {
      setError(getErrorFromApi(error));
      setStatus("error");
    }
  };

  return {
    status,
    room,
    participants,
    error,
    audioTracks,
    agentConnected,
    isMicrophoneEnabled,
    setError,
    connectToRoom,
    handleDisconnect,
    interuptAgent,
    toggleMuteLocalParticipant,
    setVoiceConversationId,
    voiceConversationId,
  };
};

export default useLivekitAudio;
