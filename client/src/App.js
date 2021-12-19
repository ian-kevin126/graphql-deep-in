import { useState } from 'react'
import BookList from './components/BookList'
import { gql, useQuery, useMutation } from '@apollo/client'
import { flowRight as compose } from 'lodash'

const ALL_BOOKS = gql`
  query GetAllBooks {
    books {
      name
      genre
      id
    }
  }
`

const ALL_AUTHORS = gql`
  query GetAllAuthors {
    authors {
      name
      id
    }
  }
`

// Define mutation
const ADD_BOOK = gql`
  mutation addBook($name: String!, $genre: String!, $authorId: ID!) {
    addBook(name: $name, genre: $genre, authorId: $authorId) {
      name
      genre
    }
  }
`

// compose was removed from React Apollo 3 (see the Breaking Changes). Now, to use compose, use lodash's flowRight.

function App() {
  const {
    loading: bookListLoading,
    error: bookListError,
    data: bookList,
  } = useQuery(ALL_BOOKS)
  const {
    loading: authorListLoading,
    error: authorListError,
    data: authorList,
  } = useQuery(ALL_AUTHORS)
  const [bookName, setBookName] = useState('')
  const [bookGenre, setBookGenre] = useState('')
  const [authorId, setAuthorId] = useState('')
  const [addBook, { data, loading, error }] = useMutation(ADD_BOOK)
  // client
  //   .query({
  //     query: gql`
  //       query GetRates {
  //         book(id: "61bf04f3c93b7b0ebaba5c6e") {
  //           name
  //         }
  //       }
  //     `,
  //   })
  //   .then((result) => console.log(result))
  console.log('authorList', authorList?.authors)

  // 添加书籍
  const addBooks = () => {
    addBook({ variables: { name: bookName, genre: bookGenre, authorId } })
  }

  return (
    <div className="App">
      <BookList />
      <div>
        <label>书籍名称：</label>
        <input onChange={(e) => setBookName(e.target.value)} />
      </div>
      <div>
        <label>书籍科目：</label>
        <input onChange={(e) => setBookGenre(e.target.value)} />
      </div>
      <div>
        <label>作者</label>
        <select onChange={(e) => setAuthorId(e.target.value)}>
          <option>请选择作作者</option>
          {authorList &&
            authorList.authors.map((item) => (
              <option value={item.id} key={item.id}>
                {item.name}
              </option>
            ))}
        </select>
      </div>
      <button onClick={addBooks}>添加书籍</button>
    </div>
  )
}

export default App
