import React, {useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import type {ChatMessage} from '@type/types';
import {MessageBubble, containsUrl} from './MessageBubble';
import {dateFormatter} from '@utils/dateFormatter';

interface Props {
  messages: ChatMessage[];
  myMemberId: number;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
  onPressNickname: (memberId: number) => void;
  onPressLink: (url: string) => void;
}

const isSameDay = (a: string, b: string): boolean => {
  const da = new Date(a);
  const db = new Date(b);
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  );
};

export const MessageList = React.memo(
  ({
    messages,
    myMemberId,
    onLoadMore,
    hasMore,
    isLoading,
    onPressNickname,
    onPressLink,
  }: Props) => {
    const renderItem = useCallback(
      ({item, index}: {item: ChatMessage; index: number}) => {
        // inverted FlatList: index+1 is older, index-1 is newer
        const olderMessage =
          index < messages.length - 1 ? messages[index + 1] : undefined;
        const showDateSeparator =
          !!olderMessage && !isSameDay(item.sentAt, olderMessage.sentAt);
        const hasLinkWarning =
          item.type === 'USER' &&
          !item.pictureFileId &&
          containsUrl(item.content);
        // 같은 발신자가 같은 날 연속으로 보낸 경우 아바타/닉네임 숨김.
        // 시스템 메시지나 날짜 경계가 끼어있으면 다시 노출.
        const showIdentity =
          item.type !== 'USER'
            ? true
            : !olderMessage ||
              showDateSeparator ||
              olderMessage.type !== 'USER' ||
              olderMessage.senderId !== item.senderId;

        return (
          <>
            {showDateSeparator && (
              <View style={styles.dateSeparatorContainer}>
                <Text style={styles.dateSeparatorText}>
                  {dateFormatter('yy년 m월 d일', new Date(item.sentAt))}
                </Text>
              </View>
            )}
            <MessageBubble
              message={item}
              isMyMessage={item.senderId === myMemberId}
              showIdentity={showIdentity}
              onPressNickname={onPressNickname}
              onPressLink={onPressLink}
            />
            {hasLinkWarning && (
              <View style={styles.linkWarningContainer}>
                <Text style={styles.linkWarningText}>
                  출처가 불분명한 링크는 클릭 시 항상 주의해 주세요
                </Text>
              </View>
            )}
          </>
        );
      },
      [messages, myMemberId, onPressNickname, onPressLink],
    );

    const renderFooter = useCallback(() => {
      if (!isLoading) return null;
      return (
        <View style={styles.loadingFooter}>
          <ActivityIndicator size="small" color="white" />
        </View>
      );
    }, [isLoading]);

    const handleEndReached = useCallback(() => {
      if (hasMore && !isLoading) {
        onLoadMore();
      }
    }, [hasMore, isLoading, onLoadMore]);

    return (
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        inverted
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        removeClippedSubviews
        maxToRenderPerBatch={10}
        windowSize={21}
        contentContainerStyle={styles.contentContainer}
      />
    );
  },
);

const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: 8,
  },
  dateSeparatorContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  dateSeparatorText: {
    fontFamily: 'Galmuri11',
    fontSize: 12,
    color: '#ffffff80',
  },
  linkWarningContainer: {
    alignItems: 'center',
    marginVertical: 6,
    marginHorizontal: 16,
  },
  linkWarningText: {
    fontFamily: 'Galmuri11',
    fontSize: 12,
    color: '#ffffff80',
  },
  loadingFooter: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});
