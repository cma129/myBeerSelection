import React, { Component } from 'react';
import './index.css';

import axios from 'axios';
import swal from 'sweetalert';

import Header from './components/Header';
import Flavour from './components/Flavour';
import Food from './components/Food';
import Selection from './components/Selection';
import Footer from './components/Footer';


class App extends Component {
  constructor() {
    super();
    this.state = {
      allBeers: [],
      userFlavourSelection: "",
      userFoodSelection: "",
      oneFlavourImg: "",
      oneFlavourName: "",
      oneFlavourTagline: "",
      oneFlavourBrewersTips: "",
      oneFoodImg: "",
      myBeerSelection: [],
    }
  }

  componentDidMount() {
    axios({
      url: 'https://api.punkapi.com/v2/beers',
      method: 'GET',
      responseType: 'json',
    })
    .then( (response) => {
      this.setState({
        allBeers: response.data
      })
    });
  }

  // Get user selection from Flavour component
  whichFlavour = (e, userFlavour) => {
    e.preventDefault();
    this.setState({
      userFlavourSelection: userFlavour
    }, () => this.findFlavour(userFlavour))
  }

  // Get user selection from Food component
  whichFood = (e, userFood) => {
    e.preventDefault();
    this.setState({
      userFoodSelection: userFood
    }, () => this.findFood(userFood))
  }

  // Use flavour user selection to filter through allBeers array, and save to state.
  findFlavour = () => {
    const copyOfAllBeers = [...this.state.allBeers];
    const randomFlavours = copyOfAllBeers.filter( (beer) => {
      return beer.description.includes(this.state.userFlavourSelection)    
    })
    // Pull random one
    const chooseRandomFlavour = (randomFlavours) => {
      const num = Math.floor( Math.random() * (randomFlavours.length));
      const oneFlavour = randomFlavours[ num ];
      const oneFlavourImg = oneFlavour.image_url;
      const oneFlavourName = oneFlavour.name;
      const oneFlavourTagline = oneFlavour.tagline;
      const oneFlavourBrewersTips = oneFlavour.brewers_tips;
      this.setState({
        oneFlavourImg: oneFlavourImg,
        oneFlavourName: oneFlavourName,
        oneFlavourTagline: oneFlavourTagline,
        oneFlavourBrewersTips: oneFlavourBrewersTips
      })
      return oneFlavourImg
    }
    this.setState({
      flavourImg: chooseRandomFlavour(randomFlavours),
    })
  }

  // Use food user selection to filter through allBeers array, and save to state.
  findFood = () => {
    const randomFoods = []
    const copyOfAllBeers = [...this.state.allBeers];
    copyOfAllBeers.forEach(beer => {
      let foodPairing = ''
      beer.food_pairing.forEach((pair) => {
        foodPairing = foodPairing + pair
      })
      if (foodPairing.includes(this.state.userFoodSelection)){
        randomFoods.push(beer);
        return randomFoods;
      }
    })
    // pull random one
    if(randomFoods.length > 0){
      const chooseRandomFood = (randomFoods) => {
        const num = Math.floor( Math.random() * (randomFoods.length));
        const oneFood = randomFoods[ num ];
        const oneFoodImg = oneFood.image_url;
        const oneFoodName = oneFood.name;
        const oneFoodTagline = oneFood.tagline;
        const oneFoodBrewersTips = oneFood.brewers_tips;
        this.setState({
                oneFoodImg: oneFoodImg,
                oneFoodName: oneFoodName,
                oneFoodTagline: oneFoodTagline,
                oneFoodBrewersTips: oneFoodBrewersTips
              })
              return oneFoodImg
            }
            this.setState({
              foodImg: chooseRandomFood(randomFoods),
            })
        // Custom error message
      } else {
          const foodErrorMessage = "There's no beer that matches this food pairing 😯";
          swal({
            title: 'Sorry',
            text: foodErrorMessage,
            dangerMode: true,
          });
      }
  }

  //Add flavour image to my beer selection
  addingFlavourToSelection = (myBeerSelection) => {
    if (myBeerSelection.length > 3) {
      const addingError = "Sorry, you already have 3 beers in your selection. Please remove some and try adding again."
      alert(addingError)
    } else {
      myBeerSelection.push(this.state.oneFlavourImg)
      return myBeerSelection
    } 
    this.setState({
      newMyBeerSelection: myBeerSelection
    })
  }

  //Remove from selection on '-' click
  //myBeerSelection.REMOVE(this)
  
  render () {
    return (
      <div className="App">
        <Header />
        <main className="wrapper">
          <div className="picks" id="picks"></div>
          <div className="flavourFoodContainer">
            <Flavour flavourGettingFunction={this.whichFlavour} flavourImgToDisplay={this.state.flavourImg} flavourName={this.state.oneFlavourName} flavourTagline={this.state.oneFlavourTagline} flavourBrewersTips={this.state.oneFlavourBrewersTips} />
            <Food foodGettingFunction={this.whichFood} foodImgToDisplay={this.state.foodImg} foodName={this.state.oneFoodName} foodTagline={this.state.oneFoodTagline} foodBrewersTips={this.state.oneFoodBrewersTips}/>
          </div>
          <Selection oneFlavourImg={this.state.oneFlavourImg} oneFoodImg={this.state.oneFoodImg} flavourName={this.state.oneFlavourName} flavourTagline={this.state.oneFlavourTagline} flavourBrewersTips={this.state.oneFlavourBrewersTips} foodName={this.state.oneFoodName} foodTagline={this.state.oneFoodTagline} foodBrewersTips={this.state.oneFoodBrewersTips} myBeerSelection={this.state.myBeerSelection} />
        </main>
        <Footer />
      </div>
    );
  }
}

export default App;