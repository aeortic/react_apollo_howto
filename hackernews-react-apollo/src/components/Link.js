import React from 'react'

 export default function Link({link}) { 
	return (
		<div>
			{link.description} ({link.url})
		</div>
	)
}
