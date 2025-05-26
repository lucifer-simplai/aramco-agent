import { Room } from "livekit-client";

export const roomOptions = {
  adaptiveStream: true,
  dynacast: true,
  publishDefaults: {
    simulcast: true,
  },
};

export const createRoom = () => {
  return new Room(roomOptions);
};
