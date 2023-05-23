/** @jsxImportSource theme-ui */
import { Flex, Box, Card, Heading, Paragraph } from '@theme-ui/components'
import { NextPageContext } from 'next'
import SquareImageBox from '../../../components/atoms/SquareImageBox'
import Breadcrumb from '../../../components/organisms/Breadcrumb'
import { weaponCategories, WeaponData } from '../../../lib/honkai3rd/weapons'
import { generateI18NPaths, getI18NProps } from '../../../server/i18n'
import { getWeaponById, getWeaponMapByIds, listWeapons } from '../../../server/data/honkai3rd/weapons'
import { useTranslation } from '../../../lib/i18n'
import Head from '../../../components/atoms/Head'
import PageLink from '../../../components/atoms/PageLink'
import { assetsBucketBaseUrl } from '../../../lib/consts'
import Honkai3rdLayout from '../../../components/layouts/Honkai3rdLayout'
import { getBattlesuitMapByIds } from '../../../server/data/honkai3rd/battlesuits'
import { BattlesuitData } from '../../../lib/honkai3rd/battlesuits'
import BattlesuitCard from '../../../components/molecules/BattlesuitCard'
import WeaponCard from '../../../components/molecules/WeaponCard'

interface WeaponShowPageProps {
  weapon: WeaponData
  battlesuitMap: { [key: string]: BattlesuitData }
  weaponMap: { [key: string]: WeaponData }
}

const WeaponShowPage = ({ weapon, battlesuitMap, weaponMap }: WeaponShowPageProps) => {
  const { t } = useTranslation()

  const weaponCategoryName = t(`weapons-show.${weapon.category}`)
  const weaponCategory = weaponCategories.find(category => category.value === weapon.category)

  return (
    <Honkai3rdLayout>
      <Head
        title={`${weapon.name} - ${t('common.honkai-3rd')} - ${t('common.abyss-lab')}`}
        description={`${t('common.honkai-3rd')} ${t('weapons-show.weapon')} / ${'⭐'.repeat(
          weapon.rarity
        )} / ${weaponCategoryName} / ATK : ${weapon.atk} / CRT : ${weapon.crt}`}
        canonicalHref={`/honkai3rd/weapons/${weapon.id}`}
      />

      <Box p={3}>
        <Breadcrumb
          items={[
            { href: '/honkai3rd', label: t('common.honkai-3rd') },
            { href: '/honkai3rd/weapons', label: t('common.weapons') },
            {
              href: `/honkai3rd/weapons/${weapon.id}`,
              label: weapon.name
            }
          ]}
        />

        <Heading as="h1">{weapon.name}</Heading>

        <Box mb={3}>
          <SquareImageBox
            size={100}
            alt={weapon.name}
            src={`${assetsBucketBaseUrl}/honkai3rd/weapons/${weapon.id}.png`}
          />
        </Box>

        <Card mb={3}>
          <Box p={2} sx={{ borderBottom: 'default' }}>
            <PageLink
              href={{
                pathname: '/honkai3rd/weapons',
                query: { category: weapon.category }
              }}
            >
              <Flex>
                {weaponCategory != null && (
                  <SquareImageBox
                    size={30}
                    src={`${assetsBucketBaseUrl}/honkai3rd/${weaponCategory.icon}.png`}
                    alt={weaponCategoryName}
                    mr={1}
                  />
                )}
                {weaponCategoryName}
              </Flex>
            </PageLink>
          </Box>
          <Box p={2} sx={{ borderBottom: 'default' }}>
            {'⭐'.repeat(weapon.rarity)}
          </Box>
          <Box p={2}>
            ATK : {weapon.atk} / CRT : {weapon.crt}
          </Box>
          {weapon.battlesuits != null && weapon.battlesuits.length > 0 && (
            <Box sx={{ p: 2, borderTop: 'default' }}>
              <Heading as="h4">{t('weapons-show.best-on')}</Heading>
              {weapon.battlesuits.map(({ id: battlesuitId }) => {
                return <BattlesuitCard key={battlesuitId} size="sm" battlesuit={battlesuitMap[battlesuitId]} />
              })}
            </Box>
          )}
          {weapon.priWeapon != null && (
            <Box sx={{ p: 2, borderTop: 'default' }}>
              <Heading as="h4">{t('weapons-show.pri-weapon')}</Heading>
              <WeaponCard size="sm" weapon={weaponMap[weapon.priWeapon]} />
            </Box>
          )}
          {weapon.originalWeapons != null && weapon.originalWeapons.length > 0 && (
            <Box sx={{ p: 2, borderTop: 'default' }}>
              <Heading as="h4">{t('weapons-show.original-weapon')}</Heading>
              {weapon.originalWeapons.map(originalWeaponId => {
                return <WeaponCard key={originalWeaponId} size="sm" weapon={weaponMap[originalWeaponId]} />
              })}
            </Box>
          )}
          {/* {weapon.sources != null && (
            <Box sx={{ p: 2, borderTop: 'default' }}>
              <Heading as='h4'>{t('weapons-show.sources')}</Heading>
              {weapon.sources
                .sort((a, b) => a.type.localeCompare(b.type))
                .map((source) => {
                  return <SourceCard key={source.type} source={source} />
                })}
            </Box>
          )} */}
        </Card>

        <Box>
          {weapon.skills.map(skill => {
            return (
              <Card key={skill.name} mb={3}>
                <Heading as="h3" p={2} m={0} sx={{ borderBottom: 'default' }}>
                  {skill.name}
                </Heading>
                <Paragraph
                  p={2}
                  sx={{
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  {skill.description}
                </Paragraph>
              </Card>
            )
          })}
        </Box>
      </Box>
    </Honkai3rdLayout>
  )
}

export default WeaponShowPage

export async function getStaticProps({ params, locale }: NextPageContext & { params: { weaponId: string } }) {
  const weapon = getWeaponById(params.weaponId, locale)
  const battlesuitMap = getBattlesuitMapByIds(
    weapon != null && weapon.battlesuits != null ? weapon.battlesuits.map(({ id }) => id) : [],
    locale
  )

  const weaponIds = []
  if (weapon != null) {
    if (weapon.priWeapon != null) {
      weaponIds.push(weapon.priWeapon)
    }
    if (weapon.originalWeapons != null) {
      weaponIds.push(...weapon.originalWeapons)
    }
  }
  const weaponMap = getWeaponMapByIds(weaponIds, locale)

  return {
    props: {
      weapon,
      battlesuitMap,
      weaponMap,
      ...(await getI18NProps(locale))
    }
  }
}

export async function getStaticPaths() {
  return {
    paths: generateI18NPaths(
      listWeapons().map(weapon => {
        return {
          params: { weaponId: weapon.id }
        }
      })
    ),
    fallback: false
  }
}
