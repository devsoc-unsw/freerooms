import { NotificationOutlined } from "@ant-design/icons";
import { styled, useTheme } from "@mui/material/styles";
import { notification } from "antd";
import { useEffect } from "react";

const OrangeLink = styled("a")(({ theme }) => ({
  color: theme.colours.accent.primary,
}));

// feedback notification banner in landing page
const FeedbackNotification = () => {
  const theme = useTheme();
  const accent = theme.colours.accent.primary;

  useEffect(() => {
    const cooldownMs = 1000 * 60 * 60 * 24 * 7; // notify every week
    const lastSeen = localStorage.getItem("last-seen-feedback-notification");
    if (lastSeen && Date.now() - parseInt(lastSeen, 10) < cooldownMs) return;

    localStorage.setItem(
      "last-seen-feedback-notification",
      Date.now().toString()
    );

    notification.info({
      title: "Found a bug or want to see a new feature added to Freerooms?",
      description: (
        <>
          Submit your{" "}
          <OrangeLink href="https://forms.gle/jMzhQXXfyQiBGjQaA">
            feedback
          </OrangeLink>
          , share your thoughts on{" "}
          <OrangeLink href="https://discord.com/invite/u9p34WUTcs">
            Discord
          </OrangeLink>
          , or open an issue on{" "}
          <OrangeLink href="https://github.com/devsoc-unsw/freerooms/issues">
            GitHub
          </OrangeLink>
          !
        </>
      ),
      icon: <NotificationOutlined style={{ color: accent }} />,
      duration: 15,
      placement: "bottomRight",
    });
  }, [accent]);

  return null;
};

export default FeedbackNotification;
