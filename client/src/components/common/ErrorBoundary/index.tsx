import { FlexDiv } from '../FlexDiv';
import { Notification } from '../Notification';
import { Text } from '../Text';

export const ErrorBoundary = () => {
  return (
    <FlexDiv alignItems="center">
      <Notification type="error">
        <Text>
          Something went wrong! Please refresh your browser and try again.
        </Text>
      </Notification>
    </FlexDiv>
  );
};
