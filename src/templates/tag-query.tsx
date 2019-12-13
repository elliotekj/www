import { graphql } from "gatsby"
import TagComponent from "../components/tag"

export default TagComponent

export const query = graphql`
  query($slug: String!) {
    allPost(sort: { fields: date, order: DESC }, filter: { tags: { elemMatch: { slug: { eq: $slug } } } }) {
      nodes {
        slug
        title
        date(formatString: "DD.MM.YYYY")
        category
        tags {
          name
          slug
        }
      }
    }
  }
`
