/** @jsx jsx */
import { jsx, useColorMode, Styled } from "theme-ui"
import { Link } from "gatsby"
import useSiteMetadata from "../hooks/use-site-metadata"
import useNavigation from "../hooks/use-navigation"
import Navigation from "./navigation"
import replaceSlashes from "../utils/replaceSlashes"

import { Flex, Box } from "@theme-ui/components"
import Title from "./title"
import GitHubButton from 'react-github-btn'

const Bottom = () => {
    const openSource = [
        {
            name: 'DeltaE',
            description: 'Quantify the difference between two colors in Rust via the CIEDE2000 algorithm.'
        },
        {
            name: 'Distil',
            description: 'An image-based colour palette generator written in Rust.'
        },
        {
            name: 'Orbit',
            description: 'A MetaWeblog API Server for Hugo.'
        },
        {
            name: 'Oxi',
            description: 'Oxi wraps an asynchronous Rust server around Mercury Parser.'
        },
        {
            name: 'Iron Middlefiddle',
            description: 'Route specific middleware made easy in Iron.'
        },
        {
            name: 'Specify',
            description: 'Quickly generate a rectangle or oval with specific dimensions and positioning in Sketch.'
        },
    ]

    return (
        <div>
            <Title text="Open Source Projects" />

            {openSource.map(os => {
                const repoUrl = `https://github.com/elliotekj/${os.name.replace(/\s+/g, '-')}`

                return (
                    <Flex sx={{
                        alignItems: [`flex-start`, `flex-start`, `center`],
                        flexDirection: [`column`, `column`, `row`],
                        pb: [3]
                    }}>
                        <Box sx={{ flex: '0 1 auto' }}>
                            <Styled.a href={repoUrl} sx={{ mr: 2 }}>{os.name}</Styled.a>
                        </Box>

                        <Box sx={{ flex: '1 1 auto', mr: 2, color: `secondary` }}>
                            {os.description}
                        </Box>

                        <Box sx={{ mt: [2, 2, 0] }}>
                            <GitHubButton
                                href={repoUrl}
                                data-icon="octicon-star"
                                data-size="large"
                                data-show-count="true"
                                aria-label={`Star elliotekj/{os.name} on GitHub`}
                            >Star</GitHubButton>
                        </Box>
                    </Flex>
                )
            })}
        </div>
    )
}

export default Bottom
