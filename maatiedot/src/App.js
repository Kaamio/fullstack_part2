import React, {useState, useEffect} from 'react';
import axios from 'axios'

const Country = ({country,results,handleClick}) => {
  
    if (results > 1) { 
      return (<div><p>{country.name}<button onClick={() => handleClick(country={country})}>show </button></p></div>   
  )} else {
            
    return (<div><h1>{country.name}</h1> 
            <p>capital {country.capital}</p>
            <p>population {country.population}</p>
            <h2>languages</h2>
            <ul>              
                {country.languages.map(details => 
                  <li key = {details.name}> {details.name} </li>)}             
            </ul>
            <img src ={country.flag} width="300" height="200"></img> 
            </div>)
  }
}

const Weather = ({results, country, city}) => {

 if ((results ===1) && (city)) {    
  return(<div>
      <h2>Weather in {country[0].name}</h2>
      <p>{city.weather[0].main}</p>
      <p>Temperature: {city.main.temp}</p>      
      <p>Wind speed: {city.wind.speed} </p>
    </div>)
  }  
 else {
  return(
    <div></div>)
  }
}


const Countries = ({countries,results,handleClick}) => {
  if ((results === 0) || (results > 10)) {
    return ('Speficy your search') }    
    else { 
      return( countries.map(country =>
        <Country key={country.name} country = {country} results = {results} handleClick={handleClick} />)
        )  }
   }  

const Countrysearch = ({ searchState, handleSearch}) => {  
  return(
    <div>
    <p>Find countries
      <input value = {searchState} 
      onChange= {handleSearch}
      /> 
      </p>         
  </div>    
  )}
  
const findCountries = ({countries, searchState}) => {
  
return (
  countries.filter(country =>country.name.toLowerCase().includes(searchState.toLowerCase()))
)
}  

const App = (props) => {
  const [countries, setCountries] = useState([])
  const [shownCountries, setShownCountries] = useState([])
  const [searchState, setSearchState ] = useState('')
  const [results, setResults ] = useState(0)
  const [weather, setWeather ] = useState('Helsinki')
  const [shownWeather, setShownWeather] = useState([{main: 'je'}])
  
const HandleSearch = (event) => {
  setSearchState(event.target.value)
  let result = findCountries({countries, searchState})
    setResults(result.length)  
    setShownCountries(result)    
    if(result.length === 1 ){      
      setWeather(result[0].capital)
    } 
  } 


const handleClick = ({country}) => {
  setResults(1)
  console.log(country)
  setWeather(country.capital)
  setShownCountries([country])    
}

useEffect(() => {
  axios
  .get('https://restcountries.eu/rest/v2/all').then(response=> {           
    setCountries(response.data)     
})
},[])

const api_key = process.env.REACT_APP_API_KEY

useEffect(() => {
  axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${weather}&appid=${api_key}`)
  .then(response=> {   
    setShownWeather(response.data)    
})
},[weather])


  return (
    <div>
   <Countrysearch countries={countries} searchState={searchState}handleSearch={HandleSearch} />     
   <div>   
   <Countries countries={shownCountries} results={results} handleClick={handleClick} />
   </div>
   <Weather results={results} country={shownCountries} city={shownWeather}/>
   </div>
  )
}

export default App;
