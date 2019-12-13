/** @jsx jsx */
import { jsx, Styled } from "theme-ui"
import { Flex, Heading } from "@theme-ui/components"
import { Link } from "gatsby"
import Layout from "./layout"
import useSiteMetadata from "../hooks/use-site-metadata"
import Listing from "./listing"
import replaceSlashes from "../utils/replaceSlashes"
import SEO from "./seo"

type Props = {
  data: {
    allPost: any
    [key: string]: any
  }
  pageContext: any
}

type TagProps = {
  posts: {
    slug: string
    title: string
    date: string
    category: string
    tags: {
      name: string
      slug: string
    }[]
  }[]
  pageContext: {
    isCreatedByStatefulCreatePages: boolean
    slug: string
    name: string
    [key: string]: any
  }
}

const Tag = ({ data, pageContext }: Props) => {
  const { allPost } = data
  const { tagsPath, basePath } = useSiteMetadata()

  return (
    <Layout>
      <SEO title={`Tag: ${pageContext.name}`} />
      <Flex sx={{ alignItems: `center`, justifyContent: `space-between`, flexFlow: `wrap` }}>
        <Heading variant="h2" as="h2">
          {pageContext.name}
        </Heading>
        <Styled.a as={Link} sx={{ variant: `links.secondary` }} to={replaceSlashes(`/${basePath}/${tagsPath}`)}>
          View all tags
        </Styled.a>
      </Flex>
      <Listing posts={allPost.nodes} sx={{ mt: [4, 5] }} />
    </Layout>
  )
}

export default Tag
