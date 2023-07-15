/** @jsxImportSource theme-ui */
import { Box, Text, Image } from '@theme-ui/components'
import PageLink from '../components/atoms/PageLink'
import RootNavigator from '../components/organisms/RootNavigator'
import Head from '../components/atoms/Head'
import { assetsBucketBaseUrl } from '../lib/consts'
import Footer from '../components/v2/Footer'

const IndexPage = () => {
  return (
    <Box>
      <Head title="Abyss Lab - Unofficial Honkai3rd Wiki" />
      <RootNavigator />
      <Box sx={{ p: 3 }}>
        <Box mb={4}>
          <PageLink href="/honkai3rd">
            <Box sx={{ position: 'relative' }}>
              <Image
                alt="Honkai 3rd Wallpaper"
                src={`${assetsBucketBaseUrl}/honkai3rd/wallpaper.png`}
                width={640}
                height={360}
              />
            </Box>
            <Text sx={{ fontSize: 3 }}>Honkai 3rd</Text>
          </PageLink>
        </Box>
        <Footer />
      </Box>
    </Box>
  )
}

export default IndexPage
