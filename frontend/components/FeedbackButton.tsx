import { BugOutlined } from "@ant-design/icons";
import { useMediaQuery } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Button as AntdButton, Tooltip } from "antd";
import React from "react";

const StyledWrapper = styled("div")(({ theme }) => ({
  position: "fixed",
  bottom: "2rem",
  right: "3rem",
  zIndex: 1000,
}));

const StyledButton = styled(AntdButton)(({ theme }) => {
  const bgColor = theme.colours.surface.paper;
  const borderColor = theme.colours.border.default;

  return {
    backgroundColor: bgColor,
    borderColor: borderColor,
    "&:hover": {
      borderColor: `${theme.colours.accent.primary} !important`,
      backgroundColor: `${bgColor} !important`,
    },
  };
});

const ThemedBugIcon = styled(BugOutlined)(({ theme }) => ({
  color: theme.colours.text.primary,
}));

// in all rooms, browse and room timetable pages
const FeedbackButton = () => {
  const feedbackForm = "https://forms.gle/jMzhQXXfyQiBGjQaA";
  const isTablet = useMediaQuery("(max-width: 1000px)");

  const openFeedbackLink = () => {
    window.open(feedbackForm, "_blank");
  };

  if (isTablet) return null;

  return (
    <StyledWrapper>
      <Tooltip title="Report a bug!">
        <StyledButton
          shape="circle"
          size="middle"
          onClick={openFeedbackLink}
          icon={<ThemedBugIcon />}
        />
      </Tooltip>
    </StyledWrapper>
  );
};

export default FeedbackButton;
