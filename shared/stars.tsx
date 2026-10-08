import { Icon } from "@astryxdesign/core/Icon";
import { HStack } from "@astryxdesign/core/Stack";
import { Text } from "@astryxdesign/core/Text";
import { Star } from "lucide-react";

export function StarRating({ rating, count }: { rating: number; count: number }) {
	const filled = Math.round(rating);

	return (
		<HStack gap={1} vAlign="center">
			{[1, 2, 3, 4, 5].map((star) => (
				<Icon key={star} icon={Star} size="sm" color={star <= filled ? "yellow" : "secondary"} />
			))}
			<Text type="body" color="secondary" hasTabularNumbers>
				{rating} ({count})
			</Text>
		</HStack>
	);
}
