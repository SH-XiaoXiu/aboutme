import type { AboutBlock } from '../../data/resume';
import ManifestoBlock from './ManifestoBlock';
import OriginBlock from './OriginBlock';
import HabitsBlock from './HabitsBlock';
import RelationshipBlock from './RelationshipBlock';
import ListBlock from './ListBlock';

export default function BlockRouter({ block }: { block: AboutBlock }) {
  switch (block.kind) {
    case 'manifesto':
      return <ManifestoBlock block={block} />;
    case 'origin':
      return <OriginBlock block={block} />;
    case 'habits':
      return <HabitsBlock block={block} />;
    case 'relationship':
      return <RelationshipBlock block={block} />;
    case 'now':
    case 'signature':
      return <ListBlock block={block} />;
    default:
      return null;
  }
}
