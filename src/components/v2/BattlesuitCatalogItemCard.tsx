import { Box } from 'theme-ui'
import { BattlesuitCatalogItem } from '../../lib/v2/data/types'
import BattlesuitAvatarIcon from './BattlesuitAvatarIcon'

interface BattlesuitCatalogItemCardProps {
  battlesuit: BattlesuitCatalogItem
  label?: boolean
}

const BattlesuitCatalogItemCard = ({ battlesuit, label = false }: BattlesuitCatalogItemCardProps) => {
  return (
    <Box
      sx={{
        mb: 2
      }}
    >
      <BattlesuitAvatarIcon battlesuit={battlesuit} />
      <Box
        sx={{
          textAlign: 'center',
          overflow: 'hidden',
          width: 110,
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}
      >
        {battlesuit.fullName}
      </Box>
    </Box>
  )
}

export default BattlesuitCatalogItemCard
