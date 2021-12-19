import React, { memo } from 'react'

function BookList(props) {
  const { books } = props
  return (
    <ul>{books && books.map((item) => <li key={item.id}>{item.name}</li>)}</ul>
  )
}

export default memo(BookList)
