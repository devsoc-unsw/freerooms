import { CreateStyled } from "@emotion/styled";

// see https://github.com/emotion-js/emotion/issues/2193
const transientOptions: Parameters<CreateStyled>[1] = {
  shouldForwardProp: (propName: string) => !propName.startsWith("$"),
};

export default transientOptions;
