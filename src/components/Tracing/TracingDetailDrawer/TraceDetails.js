import { Col, Flex, Row } from "antd";
import { dateTimeFormatYMDWithMillisecondsWithoutTimeZone } from "../../../utils/constants";
import dayjs from "../../../utils/date";
import { getTimeWithUnitFromMS } from "../../../utils/helperFunction";
import SaDate from "../../SaDate/Index";
import {
  TraceDetailContainer,
  TraceDetailHeading,
  TraceDetailValue,
} from "./style";

const TraceDetails = ({ selectedNodeDetails }) => {
  return (
    <Flex vertical gap={20} style={{ overflow: "auto" }}>
      <TraceDetailContainer>
        <Row gutter={[50, 40]}>
          <Col>
            <TraceDetailHeading>Name</TraceDetailHeading>
            <TraceDetailValue>
              {selectedNodeDetails?.name ?? "--"}
            </TraceDetailValue>
          </Col>
          <Col>
            <TraceDetailHeading>Version</TraceDetailHeading>
            <TraceDetailValue>
              {selectedNodeDetails?.data?.version ?? "--"}
            </TraceDetailValue>
          </Col>
          <Col>
            <TraceDetailHeading>User ID</TraceDetailHeading>
            <TraceDetailValue>
              {selectedNodeDetails?.user_id ?? "--"}
            </TraceDetailValue>
          </Col>
          <Col>
            <TraceDetailHeading>Source</TraceDetailHeading>
            <TraceDetailValue>
              {selectedNodeDetails?.source ?? "--"}
            </TraceDetailValue>
          </Col>
          <Col>
            <TraceDetailHeading>Latency</TraceDetailHeading>
            <TraceDetailValue>
              {selectedNodeDetails?.data?.response_time
                ? getTimeWithUnitFromMS(
                    selectedNodeDetails?.data?.response_time,
                  )
                : "--"}
            </TraceDetailValue>
          </Col>
          <Col>
            <TraceDetailHeading>Completed At</TraceDetailHeading>
            <TraceDetailValue>
              {selectedNodeDetails?.created_at ? (
                <SaDate
                  date={dayjs(
                    selectedNodeDetails?.created_at,
                    dateTimeFormatYMDWithMillisecondsWithoutTimeZone,
                  )
                    ?.tz("Asia/Kolkata", true) // Interpret the date as being in IST without converting it
                    ?.local()}
                  inline
                  time
                />
              ) : (
                "--"
              )}
            </TraceDetailValue>
          </Col>
        </Row>
      </TraceDetailContainer>
    </Flex>
  );
};

export default TraceDetails;
