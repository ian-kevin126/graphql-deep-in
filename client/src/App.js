import BookList from './components/BookList'
import { gql, useQuery } from '@apollo/client'

const ALL_BOOKS = gql`
  query GetAllBooks {
    books {
      name
      genre
      id
    }
  }
`

function App() {
  const { loading, error, data } = useQuery(ALL_BOOKS)
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
  console.log('loading', loading)
  console.log('error', error)
  console.log('data', data)

  return (
    <div className="App">
      <BookList />
    </div>
  )
}

export default App
