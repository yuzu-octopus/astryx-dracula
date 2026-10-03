import {HStack} from '@astryxdesign/core/Stack';
import {Text} from '@astryxdesign/core/Text';
import {Icon} from '@astryxdesign/core/Icon';
import {Star} from 'lucide-react';

export function StarRating({rating, count}: {rating: number; count: number}) {
  const filled = Math.round(rating);
  const empty = 5 - filled;

  return (
    <HStack gap={1} vAlign="center">
      {Array.from({length: filled}, (_, i) => (
        <Icon key={`full-${i}`} icon={Star} size="sm" color="yellow" />
      ))}
      {/* secondary, not disabled: --color-icon-disabled #6272A4 is 2.51:1 on
          the card #343746, under the 3:1 non-text floor, and reads as "this
          control is unavailable" — but a star is a data mark, not a control.
          --color-icon-secondary #9AA1BC is 4.60:1, one step under the filled
          yellow (7.4:1), so the two halves still read as one rating. */}
      {Array.from({length: empty}, (_, i) => (
        <Icon key={`empty-${i}`} icon={Star} size="sm" color="secondary" />
      ))}
      <Text type="body" color="secondary" hasTabularNumbers>
        {rating} ({count})
      </Text>
    </HStack>
  );
}
