// Copyright (c) Meta Platforms, Inc. and affiliates.

import {useState, useMemo} from 'react';
import {
  VStack,
  HStack,
  StackItem,
  Layout,
  LayoutContent,
  LayoutHeader,
} from '@astryxdesign/core/Layout';
import {Text, Heading} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {IconButton} from '@astryxdesign/core/IconButton';
import {Icon} from '@astryxdesign/core/Icon';
import {Avatar} from '@astryxdesign/core/Avatar';
import {
  PowerSearch,
  usePowerSearchConfig,
} from '@astryxdesign/core/PowerSearch';
import type {PowerSearchFilter} from '@astryxdesign/core/PowerSearch';
import {Table, proportional, pixel} from '@astryxdesign/core/Table';
import type {TableColumn} from '@astryxdesign/core/Table';
import {
  Filter,
  Download,
  Plus,
} from 'lucide-react';

interface FamiliarRow extends Record<string, unknown> {
  id: string;
  name: string;
  kind: string;
  biography: string;
  age: number;
}

const allFamiliars: FamiliarRow[] = [
  {
    id: '1',
    name: 'Vlad',
    kind: 'Vampire Bat',
    biography:
      'I love brooding in the belfry and hate garlic bread — you might wonder how well those things mix and the answer is "not that well."',
    age: 17,
  },
  {
    id: '2',
    name: 'Alucard',
    kind: 'Black Cat',
    biography: 'This is a black cat summoned by crossing the lobby at midnight',
    age: 2,
  },
  {
    id: '3',
    name: 'Archer',
    kind: 'Hellhound',
    biography:
      "I'm an 8 year old direwolf and I haunt the moors with my mom and dad.",
    age: 9,
  },
  {
    id: '4',
    name: 'Archie',
    kind: 'Raven',
    biography: 'Carrion crow at heart, raven by trade.',
    age: 5,
  },
  {
    id: '5',
    name: 'Argos',
    kind: 'Bloodhound',
    biography: 'Faithful hellhound who never gives up the scent.',
    age: 23,
  },
  {
    id: '6',
    name: 'Banjo',
    kind: 'Imp',
    biography:
      "Banjo was rescued from a cursed carnival in Concord, CA. He's a mischievous imp that loves to juggle skulls on the beach.",
    age: 9,
  },
  {
    id: '7',
    name: 'Barley',
    kind: 'Wisp',
    biography: 'Teacup-sized wisp with a full-sized haunting.',
    age: 4,
  },
  {
    id: '8',
    name: 'Beast',
    kind: 'Iron Boar',
    biography: 'Summers in Transylvania, winters in the crypt.',
    age: 14,
  },
  {
    id: '9',
    name: 'Belki',
    kind: 'Mist Ferret',
    biography: 'Belki is actually three bats in an overcoat.',
    age: 6,
  },
  {
    id: '10',
    name: 'Bella',
    kind: 'Obsidian Panther',
    biography: 'Shadow panther by day, lap cat by night.',
    age: 10,
  },
  {
    id: '11',
    name: 'Brienne',
    kind: 'Thorn Hedgehog',
    biography: 'Brienne of Bark, the cream mini hedgehog.',
    age: 7,
  },
  {
    id: '12',
    name: 'Bruno',
    kind: 'Gargoyle',
    biography:
      "Bruno is a gargoyle. He's a stony fellow — I never needed more than a day to teach him to scowl.",
    age: 5,
  },
  {
    id: '13',
    name: 'Cabo',
    kind: 'Swamp Rat',
    biography:
      'Cabo is a mix of swamp rat, imp, and unknown. Fat and grumpy but lovable.',
    age: 9,
  },
  {
    id: '14',
    name: 'Chai',
    kind: 'Moon Moth',
    biography: 'Moonlight and graveyards are the only two things that matter.',
    age: 1,
  },
  {
    id: '15',
    name: 'Charlie',
    kind: 'Direwolf',
    biography: 'The goodest boy in the whole haunted wood.',
    age: 3,
  },
  {
    id: '16',
    name: 'Coco',
    kind: 'Coffin Beetle',
    biography: 'Loves coffins and crumbs more than anything.',
    age: 6,
  },
  {
    id: '17',
    name: 'Daisy',
    kind: 'Bloodhound',
    biography: 'Will follow any blood trail anywhere, anytime.',
    age: 8,
  },
  {
    id: '18',
    name: 'Duke',
    kind: 'Hellhound',
    biography: 'Guard hound by day, couch potato by night.',
    age: 11,
  },
  {
    id: '19',
    name: 'Ella',
    kind: 'Nightmare Mare',
    biography: 'Short legs, big nightmares, endless midnight gallops.',
    age: 4,
  },
  {
    id: '20',
    name: 'Finn',
    kind: 'Frost Lynx',
    biography: 'Loves snowstorms and howling at the blood moon.',
    age: 7,
  },
  {
    id: '21',
    name: 'Ginger',
    kind: 'Ember Salamander',
    biography: 'Red and rambunctious with boundless hellfire.',
    age: 5,
  },
  {
    id: '22',
    name: 'Hank',
    kind: 'Grave Toad',
    biography: 'Warts for days and a croak that never quits.',
    age: 9,
  },
  {
    id: '23',
    name: 'Izzy',
    kind: 'Shadow Fox',
    biography: 'Smarter than most necromancers I know.',
    age: 3,
  },
  {
    id: '24',
    name: 'Jax',
    kind: 'Iron Boar',
    biography: 'Gentle giant who loves kids and belly scratches.',
    age: 6,
  },
  {
    id: '25',
    name: 'Koda',
    kind: 'Obsidian Panther',
    biography: 'Loyal, fluffy, and fiercely protective of the crypt.',
    age: 8,
  },
  {
    id: '26',
    name: 'Luna',
    kind: 'Night Owl',
    biography: 'A cloud on silent wings with a permanent stare.',
    age: 2,
  },
  {
    id: '27',
    name: 'Max',
    kind: 'Gargoyle',
    biography: 'Looks tough, but melts for ear scratches.',
    age: 10,
  },
  {
    id: '28',
    name: 'Nala',
    kind: 'Sable Marten',
    biography: 'Hypoallergenic and proud of it.',
    age: 4,
  },
  {
    id: '29',
    name: 'Oscar',
    kind: 'Cave Eel',
    biography: 'Long boy of the underground rivers with big dreams.',
    age: 12,
  },
  {
    id: '30',
    name: 'Penny',
    kind: 'Moon Moth',
    biography: 'Lap moth extraordinaire and candle connoisseur.',
    age: 7,
  },
  {
    id: '31',
    name: 'Rex',
    kind: 'Hellhound',
    biography: 'Fast, fearless, and first to the blood bowl.',
    age: 5,
  },
  {
    id: '32',
    name: 'Sadie',
    kind: 'Direwolf',
    biography: 'Herds everything, including the ghosts.',
    age: 3,
  },
  {
    id: '33',
    name: 'Tucker',
    kind: 'Bloodhound',
    biography: 'Tennis ball enthusiast and professional fetcher of bones.',
    age: 6,
  },
  {
    id: '34',
    name: 'Willow',
    kind: 'Nightmare Mare',
    biography: 'Retired racer, full-time lounger in the mist.',
    age: 8,
  },
  {
    id: '35',
    name: 'Zeus',
    kind: 'Gargoyle',
    biography: 'Thinks he is a lap gargoyle despite weighing 150 lbs.',
    age: 4,
  },
  {
    id: '36',
    name: 'Rosie',
    kind: 'Imp',
    biography: 'Tiny but mighty with a cackle bigger than her bite.',
    age: 2,
  },
  {
    id: '37',
    name: 'Scout',
    kind: 'Raven',
    biography: 'Adventure buddy who never says no to a midnight flight.',
    age: 5,
  },
  {
    id: '38',
    name: 'Teddy',
    kind: 'Albino Crocodile',
    biography: 'Gentle giant of the castle moat.',
    age: 7,
  },
];

const kindValues = [
  {value: 'Vampire Bat', label: 'Vampire Bat'},
  {value: 'Black Cat', label: 'Black Cat'},
  {value: 'Hellhound', label: 'Hellhound'},
  {value: 'Raven', label: 'Raven'},
  {value: 'Bloodhound', label: 'Bloodhound'},
  {value: 'Imp', label: 'Imp'},
  {value: 'Wisp', label: 'Wisp'},
  {value: 'Iron Boar', label: 'Iron Boar'},
  {value: 'Mist Ferret', label: 'Mist Ferret'},
  {value: 'Obsidian Panther', label: 'Obsidian Panther'},
  {value: 'Thorn Hedgehog', label: 'Thorn Hedgehog'},
  {value: 'Gargoyle', label: 'Gargoyle'},
  {value: 'Swamp Rat', label: 'Swamp Rat'},
  {value: 'Moon Moth', label: 'Moon Moth'},
  {value: 'Direwolf', label: 'Direwolf'},
  {value: 'Coffin Beetle', label: 'Coffin Beetle'},
  {value: 'Nightmare Mare', label: 'Nightmare Mare'},
  {value: 'Frost Lynx', label: 'Frost Lynx'},
  {value: 'Ember Salamander', label: 'Ember Salamander'},
  {value: 'Grave Toad', label: 'Grave Toad'},
  {value: 'Shadow Fox', label: 'Shadow Fox'},
  {value: 'Night Owl', label: 'Night Owl'},
  {value: 'Sable Marten', label: 'Sable Marten'},
  {value: 'Cave Eel', label: 'Cave Eel'},
  {value: 'Albino Crocodile', label: 'Albino Crocodile'},
  {value: 'Crypt Spider', label: 'Crypt Spider'},
  {value: 'Carrion Crow', label: 'Carrion Crow'},
  {value: 'Bone Vulture', label: 'Bone Vulture'},
  {value: 'Albino Python', label: 'Albino Python'},
];

const fieldDefs = [
  {key: 'name', type: 'string', label: 'Name'},
  {key: 'kind', type: 'enum', label: 'Kind', enumValues: kindValues},
  {key: 'biography', type: 'string', label: 'Biography'},
] as const;

const columns: TableColumn<FamiliarRow>[] = [
  {
    key: 'name',
    header: 'Name',
    width: proportional(2),
    renderCell: (item: FamiliarRow) => (
      <HStack gap={3} vAlign="center">
        <Avatar name={item.name} size="md" />
        <VStack gap={0}>
          <Text type="body">{item.name}</Text>
          <Text type="supporting" color="secondary">
            {item.kind}
          </Text>
        </VStack>
      </HStack>
    ),
  },
  {
    key: 'biography',
    header: 'Biography',
    width: proportional(5),
    renderCell: (item: FamiliarRow) => <Text type="body">{item.biography}</Text>,
  },
  {
    key: 'age',
    header: 'Age',
    width: pixel(80),
    renderCell: (item: FamiliarRow) => (
      <Text type="body" hasTabularNumbers>
        {item.age}
      </Text>
    ),
  },
];

export default function TablePage() {
  const [filters, setFilters] = useState<PowerSearchFilter[]>([]);
  const {config, applyFilters} = usePowerSearchConfig(fieldDefs, 'Familiars');

  const filtered = useMemo(() => {
    return applyFilters(filters, allFamiliars);
  }, [filters, applyFilters]);

  return (
    <Layout
      height="fill"
      header={
        <LayoutHeader hasDivider>
          <HStack gap={2} vAlign="center">
            <StackItem size="fill">
              <Heading level={1}>Familiars</Heading>
            </StackItem>
            <IconButton
              label="Filter"
              icon={<Icon icon={Filter} size="sm" />}
              variant="ghost"
            />
            <IconButton
              label="Download"
              icon={<Icon icon={Download} size="sm" />}
              variant="ghost"
            />
            <Button label="Add" icon={<Icon icon={Plus} size="sm" />} />
          </HStack>
        </LayoutHeader>
      }
      content={
        <LayoutContent padding={3}>
          <VStack gap={4}>
            <PowerSearch
              config={config}
              filters={filters}
              onChange={newFilters => {
                setFilters([...newFilters]);
              }}
              placeholder="Search familiars..."
              resultCount={filtered.length}
            />
            <Table<FamiliarRow>
              data={filtered}
              columns={columns}
              idKey="id"
              density="balanced"
              dividers="rows"
              hasHover
            />
          </VStack>
        </LayoutContent>
      }
    />
  );
}
