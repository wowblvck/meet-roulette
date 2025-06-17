"use client";

import { useEffect, useState } from "react";
import {
  meet,
  MeetSidePanelClient,
} from "@googleworkspace/meet-addons/meet.addons";
import { CLOUD_PROJECT_NUMBER, MAIN_STAGE_URL } from "../../constants";
import Participants from "@/widgets/participants";

export default function Page() {
  const [sidePanelClient, setSidePanelClient] = useState<MeetSidePanelClient>();
  const [meetId, setMeetId] = useState<string>();

  async function startActivity(e: unknown) {
    if (!sidePanelClient) {
      throw new Error("Side Panel is not yet initialized!");
    }
    await sidePanelClient.startActivity({ mainStageUrl: MAIN_STAGE_URL });
  }

  useEffect(() => {
    (async () => {
      const session = await meet.addon.createAddonSession({
        cloudProjectNumber: CLOUD_PROJECT_NUMBER,
      });

      const sidePanel = await session.createSidePanelClient();
      setSidePanelClient(sidePanel);

      const meetingInfo = await sidePanel.getMeetingInfo();
      setMeetId(meetingInfo.meetingId);
    })();
  }, []);

  return (
    <>
      {meetId ? (
        <>
          <Participants meetId={meetId} />
          <button onClick={startActivity}>Запустить рулетку</button>
        </>
      ) : (
        <p>Загрузка...</p>
      )}
    </>
  );
}
