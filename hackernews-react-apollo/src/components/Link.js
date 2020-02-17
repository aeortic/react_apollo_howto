import React from 'react'
import gql from 'graphql-tag'
import {useMutation} from '@apollo/react-hooks'
import {AUTH_TOKEN} from '../constants'
import {timeDifferenceForDate} from '../utils'

const VOTE_MUTATION = gql`
  mutation VoteMutation($linkId: ID!) {
    vote(linkId: $linkId) {
      id
      link {
        id
        votes {
          id
          user {
            id
          }
        }
      }
      user {
        id
      }
    }
  }
`

const voteHandler = (id, vote) => {
  vote({
    variables: {linkId: id},
  })
}

export default function Link({index, link}) {
  const [vote, {data}] = useMutation(VOTE_MUTATION,
    {
      onCompleted(payload) {
        console.log("payload:")
        console.log(payload)
        console.log("++++++")
        console.log("data:")
        console.log(data)
        console.log("========")
      }
    }
  )
  const authToken = localStorage.getItem(AUTH_TOKEN)
	return (
    <div className="flex mt2 items-start">
      <div className="flex items-center">
        <span className="gray">{index + 1}.</span>
        {authToken && (
          <div className="ml1 gray f11" onClick={() => voteHandler(link.id, vote)}>
            vote up
          </div>
        )}
      </div>
      <div className="ml1">
    		<div>
    			{link.description} ({link.url})
        </div>
        <div className="f6 lh-copy gray">
          {link.votes.length} votes | by{' '}
          {link.postedBy
            ? link.postedBy.name
            : 'Unknown'}{' '}
          {timeDifferenceForDate(link.createdAt)}
        </div>
  		</div>
    </div>
	)
}
