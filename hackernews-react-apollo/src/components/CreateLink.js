import React from 'react'
import gql from 'graphql-tag'
import {useMutation} from '@apollo/react-hooks';
import {useHistory} from "react-router-dom";

const POST_MUTATION = gql`
  mutation PostMutation($description: String!, $url: String!) {
    post(description: $description, url: $url) {
      id
      createdAt
      url
      description
    }
  }
`

export default function CreateLink (){

  const [post, {data}] = useMutation(POST_MUTATION,
    {
      onCompleted() { history.push('/') }
    }
  );
  let descriptionInput;
  let urlInput;
  let history = useHistory();
  return (
    <>
      <form className="flex flex-column mt3"
        onSubmit={e => {
          e.preventDefault();
          post({
            variables: {url: urlInput.value, description: descriptionInput.value},
          });
          urlInput.value = '';
          descriptionInput.value = '';
        }}
      >
        <input
          className="mb2"
          ref={node => {
            descriptionInput = node;
          }}
          type="text"
          placeholder="A description for the link "
        />
        <input
          className="mb2"
          ref={node => {
            urlInput = node;
          }}
          type="text"
          placeholder="The URL for the link"
        />
        <button type="submit">Submit</button>
      </form>
    </>
  ) 
}
