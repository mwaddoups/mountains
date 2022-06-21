import React from "react"
import tw from "twin.macro"

const Paragraph = tw.p`my-3 ml-3 tracking-wide font-light`
const Section = tw.div`rounded shadow p-4 mb-4`
const Heading = tw.h1`text-3xl font-bold tracking-tight`
const Link = tw.a`text-blue-700 hover:text-blue-400`
const List = tw.ul`list-disc ml-3`
const ListItem = tw.li`font-light mb-2`

export default function Resources() {
    return <Section>
        <Heading>Resources</Heading>
        <Paragraph>This page contains links for some websites that may be useful if you are planning hikes or looking to develop your skills. As well as links to some of the Mountaineering Scotland benefits that are available to paid club members.</Paragraph>
        <List>
            <ListItem><Link href="https://walkhighlands.co.uk" title="Walkhighlands" target="_blank" rel="noreferrer">Walkhighlands</Link>: 
                a one stop shop for finding detailed route descriptions as well as gpx files for use with GPS.
            </ListItem>
            <ListItem><Link href="https://www.metoffice.gov.uk/weather/specialist-forecasts/mountain" title="Met Office Mountain Weather" target="_blank" rel="noreferrer">Met Office Mountain Weather Forecasts</Link>:
                great for finding mountain specific weather forecasts a few days before your hike.
            </ListItem>
            <ListItem><Link href="https://www.mwis.org.uk/" title="Mountain Weather Information Service" target="_blank" rel="noreferrer">Mountain Weather Information Service</Link>:
                an alternative mountain weather forecast service, doesn't provide mountain specific forecasts like the met office but it's still handy.
            </ListItem>
            <ListItem><Link href="https://www.bing.com/maps/" title="Bing Maps" target="_blank" rel="noreferrer">Bing Maps (seriously)</Link>:
               they provide a free ordance survey overlay which can be accessed at the top right of the page, this is great for planning trips.
            </ListItem>
            <ListItem><Link href="https://shop.ordnancesurvey.co.uk/apps/os-maps-subscriptions/" title="OS Maps" target="_blank" rel="noreferrer">OS Maps App</Link>:
               this paid app allows you to use OS maps on your phone in combination with GPS. it's always good to have the skills to use a paper map but this is very useful. There are other paid and free alternatives available.
            </ListItem>
            <ListItem><Link href="https://www.mountaineering.scot/safety-and-skills/courses-and-events/courses" title="Mountaineering Scotland Courses" target="_blank" rel="noreferrer">Mountaineering Scotland Courses</Link>:
                if you are a paid club member you are also a member of mountaineering Scotland, this gives you access to courses for developing your outdoors skills for example navigation or winter mountaineering.
            </ListItem>
            <ListItem><Link href="https://www.mountaineering.scot/members/members-benefits/your-discounts" title="Outdoor Kit Discounts" target="_blank" rel="noreferrer">Outdoor Kit Discounts</Link>:
                as a mountaineering Scotland member you get access to a wide range of discounts on kit.
            </ListItem>
            <ListItem><Link href="https://www.mountaineering.scot/huts" title="Club Huts" target="_blank" rel="noreferrer">Club Huts</Link>:
                as a mountaineering Scotland member you can book stays at affordable huts all around Scotland.
            </ListItem>
        </List>
    </Section>
}