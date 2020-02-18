import React from 'react'
import {useQuery} from '@apollo/react-hooks'
import gql from 'graphql-tag'
import Link from './Link'

const FEED_QUERY = gql`
  {
    feed {
      links {
        id
        createdAt
        url
        description
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
    }
  }
`

const NEW_LINKS_SUBSCRIPTION = gql`
  subscription {
    newLink {
      id
      url
      description
      createdAt
      postedBy {
        id
        name
      }
      votes {
        id
        user {
          id
        }
      }
    }
  }
`

const subscribeToNewLinks = subscribeToMore => {
  subscribeToMore({
    document: NEW_LINKS_SUBSCRIPTION,
    updateQuery: (prev, {subscriptionData}) => {
      if (!subscriptionData.data) return prev
      const newLink = subscriptionData.data.newLink
      const exists = prev.feed.links.find(({id}) => id === newLink.id);
      if (exists) return prev;

      return Object.assign({}, prev, {
        feed: {
          links: [newLink, ...prev.feed.links],
          count: prev.feed.links.length + 1,
          __typename: prev.feed.__typename
        }
      })
    }
  })
}

const NEW_VOTES_SUBSCRIPTION = gql`
  subscription {
    newVote {
      id
      link {
        id
        url
        description
        createdAt
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
    }
  }
`

const subscribeToNewVotes = subscribeToMore => {
  subscribeToMore({
    document: NEW_VOTES_SUBSCRIPTION
  })
}

export default function LinkList() {
  const {loading, error, data, subscribeToMore} = useQuery(FEED_QUERY); 

  if (loading) return <div>Fetching</div>
  if (error) return <div>Error</div>

  subscribeToNewLinks(subscribeToMore)
  subscribeToNewVotes(subscribeToMore)

  const linksToRender = data.feed.links

  return (
    <div>
      {
        linksToRender
        .filter(link => link.description && link.url)
        .map((link, index) => <Link key={link.id} link={link} index={index}/>)
      }
    </div>
  )
}
