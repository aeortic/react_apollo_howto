import React, {Component} from 'react'
import Link from './Link'

class LinkList extends Component {
  render() {
    const linksToRender = [
      {
        id: '1',
        description: 'Prisma turns your database into a GraphQl API',
        url: 'https://www.prismagraphql.com',
      },
      {
        id: '2',
        description: 'The best GraphQl client',
        url: 'https://www.apollographql.com/docs/react',
      },
    ]

    return (
      linksToRender.map(link => <Link key={link.id} link={link} />)
      )
  }
}

export default LinkList