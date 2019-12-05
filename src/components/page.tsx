/** @jsx jsx */
import { jsx } from "theme-ui"
import { Heading } from "@theme-ui/components"
import { MDXRenderer } from "gatsby-plugin-mdx"
import Layout from "./layout"
import SEO from "./seo"

type Props = {
  data: {
    page: any
    [key: string]: any
  }
}

type PageProps = {
  data: {
    page: {
      title: string
      slug: string
      excerpt: string
      body: string
    }
  }
}

const Page = ({ data }: Props) => {
  const { page } = data

  return (
     <Layout>
      <SEO title={page.title} description={page.excerpt} />
      <Heading variant="h2" as="h2">
        {page.title}
      </Heading>
      <section sx={{ my: 5 }}>
        <MDXRenderer>{page.body}</MDXRenderer>
      </section>
    </Layout>
  )
}

export default Page
