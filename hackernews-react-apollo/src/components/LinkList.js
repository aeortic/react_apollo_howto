import React from 'react'
import {useQuery} from '@apollo/react-hooks'
import gql from 'graphql-tag'
import Link from './Link'
import {LINKS_PER_PAGE} from '../constants'

const getQueryVariables = (pathname, pageString) => {
  const isNewPage = pathname.includes('new')
  const page = parseInt(pageString, 10)

  const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0
  const first = isNewPage ? LINKS_PER_PAGE : 100
  const orderBy = isNewPage ? 'createdAt_DESC' : null
  return {
    first,
    skip,
    orderBy,
    isNewPage,
  }
}

const FEED_QUERY = gql`
  query FeedQuery($first: Int, $skip: Int, $orderBy: LinkOrderByInput) {
    feed (first: $first, skip: $skip, orderBy: $orderBy) {
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
      count
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

const previousPage = () => {

}

const nextPage = data => {

}

const getLinksToRender = (pathname, links) => {
  const isNewPage = pathname.includes('new')
  if (isNewPage) {
    return links
  }
  const rankedLinks = links.slice()
  rankedLinks.sort((l1, l2) => l2.votes.length - l1.votes.length)
  return rankedLinks
}

export default function LinkList({
  location: {pathname},
  match: {params: {page}}
}) {
  const {
    first,
    skip,
    orderBy,
    isNewPage,
  } = getQueryVariables(pathname, page)

  const {loading, error, data, subscribeToMore} = useQuery(FEED_QUERY, {
    variables: {first, skip, orderBy}
  }); 

  if (loading) return <div>Fetching</div>
  if (error) return <div>Error</div>

  subscribeToNewLinks(subscribeToMore)
  subscribeToNewVotes(subscribeToMore)

  const linksToRender = getLinksToRender(pathname, data.feed.links)

  return (
    <>
      {
        linksToRender
        .filter(link => link.description && link.url)
        .map((link, index) => (
          <Link 
            key={link.id} 
            link={link} 
            index={index + skip}/>
        ))
      }
      {isNewPage && (
        <div className="flex ml4 mv3 gray">
          <div className="pointer mr2" onclick={previousPage}>
            Previous
          </div>
          <div className="pointer" onClick={() => nextPage(data)}>
            Next
          </div>
        </div>
      )}
    </>
  )
}
