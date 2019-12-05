/** @jsx jsx */
import { jsx, Styled } from "theme-ui"
import { Flex } from "@theme-ui/components"
import useSiteMetadata from "../hooks/use-site-metadata"

const Footer = () => {
  const { siteTitle, externalLinks } = useSiteMetadata()

  return (
    <Flex
      as="footer"
      sx={{
        variant: `dividers.top`,
        justifyContent: `space-between`,
        mt: [6],
        color: `secondary`,
        a: {
          variant: `links.secondary`,
        },
        flexDirection: [`column`, `column`, `row`],
      }}
    >
      <div>
        &copy; {new Date().getFullYear()} by {siteTitle}. All rights reserved.
      </div>

      <div sx={{ "a:not(:first-of-type)": { ml: 3 } }}>
          {externalLinks.map(link => (
          <Styled.a key={link.url} href={link.url}>
              {link.name}
          </Styled.a>
          ))}
      </div>
    </Flex>
  )
}

export default Footer
