// import _ from 'lodash'
import React, { useState } from 'react'
import { Search, Grid, Icon } from 'semantic-ui-react'
import axios from 'axios'
import defaultImage from '../../../../assets/img/productImagePlaceholder.png';
import { Link } from "react-router-dom"
import { isMobile } from 'react-device-detect';

const initialState = {
  loading: false,
  results: [],
  value: ''
}

function exampleReducer(state, action) {

  switch (action.type) {
    case 'CLEAN_QUERY':
      return initialState
    case 'START_SEARCH':
      return { ...state, loading: true, value: action.query }
    case 'FINISH_SEARCH':
      return { ...state, loading: false, results: action.results }
    case 'UPDATE_SELECTION':
      // props.hideSearch()
      return { ...state, value: action.selection }

    default:
      throw new Error()
  }
}

const resultRenderer = (pro) => <div className="recomended-search">
  {/* defaultImage  */}
  <Link to={"/product/" + pro.handle}>
    <img src={pro.image ? pro.image : defaultImage} alt="" />
    <p>{pro.title}</p>
  </Link>

</div>

function SearchExampleStandard(props) {
  const [state, dispatch] = React.useReducer(exampleReducer, initialState)
  // const [reroute, setReroute] = useState(false)
  const [searchQuery, setsearchQuery] = useState('')
  const [category, setCategory] = useState('')
  const { loading, results, value } = state
  if (category !== props.cat) {
    setCategory(props.cat)
  }

  // const search = () => {
  //   
  //   dispatch({
  //     type: 'CLEAN_QUERY'
  //   })
  //   setReroute(true)
  // } 

  // const closeSearchPopUp = () => {
  //   props.hideSearch
  // }

  const timeoutRef = React.useRef()
  const handleSearchChange = React.useCallback((e, data) => {
    // debugger
    clearTimeout(timeoutRef.current)
    dispatch({ type: 'START_SEARCH', query: data.value })

    timeoutRef.current = setTimeout(() => {
      if (data.value.length === 0) {
        dispatch({ type: 'CLEAN_QUERY' })
        return
      }
      // const re = new RegExp(_.escapeRegExp(data.value), 'i')
      // const isMatch = (result) => re.test(result.title)

      //hit search api
      setsearchQuery(data.value)
      let toHit = process.env.REACT_APP_BACKEND_HOST + '/storefront/search_products?q=' + data.value + '&limit=5'


      if (data.cat) {
        toHit = process.env.REACT_APP_BACKEND_HOST + '/storefront/search_products?q=' + data.value + '&limit=5' + '&category=' + data.cat
      }
      axios.get(toHit)
        .then((response) => {
          dispatch({
            type: 'FINISH_SEARCH',
            results: response.data.results,
          })
        })
        .catch(function (error) {
          console.log(error)
        })

    }, 300)
  }, [])



  React.useEffect(() => {
    // setCat(props.cat)
    return () => {
      clearTimeout(timeoutRef.current)
    }
  }, [])



  return (

    <Grid>
      <Grid.Column >
        <Search
          loading={loading}
          onResultSelect={(e, data) => {
            if (isMobile) {
              props.hideSearch()
            }
            else{
//  console.log(props);
            // debugger
            
            props.close()
            }
           
            dispatch({ type: 'UPDATE_SELECTION', selection: data.result.title })
          }

          }
          onFocus={handleSearchChange}
          cat={category}
          onSearchChange={handleSearchChange}
          results={results}
          resultRenderer={resultRenderer}
          value={value}
          icon="none"
          placeholder='What are you looking for?'
        />

        <Link to={category ? '/search/' + searchQuery + '+' + category : '/search/' + searchQuery}>

          <div onClick={props.close}>
            <Icon className="search-btn" name={loading ? "none" : "search"} />
          </div>

          {/* <Button className="search-btn" loading={loading} icon onClick={props.hideSearch} >
            <Icon name={loading ? "none" : "search"} />
          </Button> */}
        </Link>
      </Grid.Column>
      {/* {
        reroute ? 
          <Redirect  />
        : null  
      } */}
    </Grid>
  )
}

export default SearchExampleStandard