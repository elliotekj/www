/** @jsx jsx */
import { jsx } from "theme-ui"
import { Heading, Flex, Button, Link } from "@theme-ui/components"
import { MDXRenderer } from "gatsby-plugin-mdx"
import React from "react"
import Layout from "./layout"
import ItemTags from "./item-tags"
import SEO from "./seo"

type Props = {
  data: {
    post: any
    [key: string]: any
  }
}

type PostProps = {
  data: {
    post: {
      slug: string
      rewriteSlug: string
      title: string
      date: string
      category: string
      tags?: {
        name: string
        slug: string
      }[]
      description?: string
      body: string
      excerpt: string
      timeToRead: number
      banner?: {
        childImageSharp: {
          resize: {
            src: string
          }
        }
      }
    }
  }
}

const px = [`32px`, `16px`, `8px`, `4px`]
const shadow = px.map(v => `rgba(0, 0, 0, 0.15) 0px ${v} ${v} 0px`)

const Post = ({ data }: Props) => {
  const { post } = data

  return (
    <Layout>
      <SEO
        title={post.title}
        description={post.description ? post.description : post.excerpt}
        image={post.banner ? post.banner.childImageSharp.resize.src : undefined}
      />
      <Heading variant="h2" as="h2">
        {post.title}
      </Heading>
      <p sx={{ color: `secondary`, mt: 3, a: { color: `secondary` }, fontSize: [1, 1, 2] }}>
        <time>{post.date}</time>
        {post.tags && (
          <React.Fragment>
            {` — `}
            <ItemTags tags={post.tags} />
          </React.Fragment>
        )}
        {` — `}
        <span>{post.timeToRead} min read</span>
      </p>
      <section sx={{ my: 5, ".gatsby-resp-image-wrapper": { my: [4, 4, 5], boxShadow: shadow.join(`, `) } }}>
        <MDXRenderer>{post.body}</MDXRenderer>
      </section>


      <Flex sx={{ flexDirection: [`column`, `row`, `row`], justifyContent: [`flex-start`, `flex-start`, `center`] }}>
          <Link href="https://elliotekj.substack.com" sx={{ mx: [0, 2, 2], my: [2, 0, 0] }}>
            <Button>Subscribe via Newsletter</Button>
          </Link>

          <Link href="/rss.xml" sx={{ mx: [0, 2, 2], my: [2, 0, 0] }}>
            <Button sx={{ background: '#f36523' }}>Subscribe via RSS</Button>
          </Link>

          <Link href="https://dev.to/elliotekj" sx={{ mx: [0, 2, 2], my: [2, 0, 0] }}>
            <Button sx={{ background: '#000' }}>Follow on Dev.to</Button>
          </Link>
      </Flex>
    </Layout>
  )
}

export default Post
