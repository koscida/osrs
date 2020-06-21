import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import herbData from './data/herblore.json';

/* https://www.npmjs.com/package/osrs-json-api */
// const { ge } = require('osrs-json-api');

// ge.getGraph(12934)
//     .then(console.log)
//     .catch(console.error);



class Herblore extends React.Component {
	
	constructor(props) {
		super(props);
		
		this.state = {
			potions : herbData.allPotions,
			ingredients : herbData.allIngredients,
			bases : herbData.allUnfBases,
			vials : herbData.allVials,
			herbs : herbData.allHerbs,
			
			isExpandPotion : false,
			isExpandBase : false,
			isExpandIngredient : false
		}
		
	}
	
	loadHerbData() {
		
		const { GE_URLS } = require('./data/constants');
		const CORS = 'https://cors-anywhere.herokuapp.com/';
		
		var id = 12934;
		
		var url = `${CORS}http://services.runescape.com/m=itemdb_oldschool/api/graph/${id}.json`;
		console.log(url);
		
		url = `${CORS}http://services.runescape.com/m=itemdb_oldschool/api/catalogue/detail.json?item=${id}`;
		console.log(url);
		
		
		fetch(url) 
			.then(res =>  res.json())
			.then(data => console.log(data))
			.catch(console.log);
		
	}
	
	toggleExpandPotion = () => {
		this.setState(prevState => ({isExpandPotion : !prevState.isExpandPotion}));
	}
	
	toggleExpandBase = () => {
		this.setState(prevState => ({isExpandBase : !prevState.isExpandBase}));
	}
	
	toggleExpandIngredient = () => {
		this.setState(prevState => ({isExpandIngredient : !prevState.isExpandIngredient}));
	}
	
	generateTableHeader() {
		let header = [];
		let headerTop = [];
		let headerBottom = [];
		
		headerTop.push(<th colSpan="2">Finished product</th>);
		headerBottom.push(<th>Potion</th>);
		headerBottom.push(<th>GE (3)</th>);
		
		
		headerTop.push(<th colSpan="2">Base</th>);
		
		headerBottom.push(<th>Unf Base</th>);
		headerBottom.push(<th>GE</th>);
		if(this.state.isExpandBase) {
			headerTop.push(<th colSpan="4">Herb(s)</th>);
			
			headerBottom.push(<th>Grimy Herb</th>);
			headerBottom.push(<th>GE</th>);
			headerBottom.push(<th>Clean Herb</th>);
			headerBottom.push(<th>GE</th>);
			
			headerTop.push(<th colSpan="2">Vial</th>);
			
			headerBottom.push(<th>Vial</th>);
			headerBottom.push(<th>GE</th>);
		}
		
		headerTop.push(<th colSpan="2">Ingredient</th>);
			
		headerBottom.push(<th>Ingredient(s)</th>);
		headerBottom.push(<th>GE</th>);
		if(this.state.isExpandIngredient) {
			
		}
		
		header.push(<tr>{headerTop}</tr>);
		header.push(<tr>{headerBottom}</tr>);
		
		return header;
	}
	
	generateTableRows() {
		//const rows = this.state.potions.map((potion, rowIndex, arr) => {
		const pots = this.state.potions;
		const bases = this.state.bases;
		const herbs = this.state.herbs;
		const vials = this.state.vials;
		const ingredients = this.state.ingredients;
		
		const rows = Object.keys(pots).map( (key, index) => {
			let pot = pots[key];
			let row = [];
			
			row.push(<td>{pot.name}</td>);
			row.push(<td></td>);
			
			
			if("baseKey" in pot) 
				row.push(<td>{bases[pot.baseKey].name}</td>);
			if("basePotKey" in pot) {
				if(!Array.isArray(pot.basePotKey))
					row.push(<td>{pots[pot.basePotKey].name}</td>);
				else
					row.push(<td>TODO (array)</td>)
			}
			row.push(<td></td>);
			
			if(this.state.isExpandBase) {
				if("baseKey" in pot) {
					if("herbKey" in bases[pot.baseKey]) {
						row.push(<td>{herbs[bases[pot.baseKey].herbKey].grimy.name}</td>);
						row.push(<td></td>);
						row.push(<td>{herbs[bases[pot.baseKey].herbKey].clean.name}</td>);
						row.push(<td></td>);
					} else if("ingredientKey" in bases[pot.baseKey]) {
						row.push(<td>{ingredients[bases[pot.baseKey].ingredientKey].name}</td>);
						row.push(<td></td>);
						row.push(<td></td>);
						row.push(<td></td>);
					}
					row.push(<td>{vials[bases[pot.baseKey].vialKey].name}</td>);
					row.push(<td></td>);
				} else if("basePotKey" in pot) {
					if(!Array.isArray(pot.basePotKey)) {
						row.push(<td>{bases[pots[pot.basePotKey].baseKey].name}</td>);
						row.push(<td></td>);
					} else {
						row.push(<td>(arr)</td>);
					}
					row.push(<td></td>);
					row.push(<td></td>);
					
					row.push(<td>(vial?))</td>);
					row.push(<td></td>);
				}
			}
			
			row.push(<td></td>);
			row.push(<td></td>);
			if(this.state.isExpandIngredient) {
				
			}
			
			return(<tr>{row}</tr>);
		});
		
		return (rows);
	}
	
	render() {
		return (
			<>
				<button onClick={this.loadHerbData}>Load</button>
				
				<div>
					<label htmlFor="expandPotion">Expand potions:</label>
					<input type="checkbox" checked={this.state.isExpandPotion} id="expandPotion" onChange={this.toggleExpandPotion}/>
				</div>
				
				<div>
					<label htmlFor="expandBase">Expand bases:</label>
					<input type="checkbox" checked={this.state.isExpandBase} id="expandBase" onChange={this.toggleExpandBase}/>
				</div>
				
				<div>
					<label htmlFor="expandIngredient">Show ingredients:</label>
					<input type="checkbox" checked={this.state.isShowIngredient} id="expandIngredient" onChange={this.toggleShowIngredient}/>
				</div>
				
				
				
				<table>
					<thead>
						{this.generateTableHeader()}
					</thead>
					<tbody>{this.generateTableRows()}</tbody>
				</table>
			</>
		);
	}	
}

ReactDOM.render(
	<React.StrictMode>
		<Herblore />
	</React.StrictMode>,
	document.getElementById('root')
);	

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA

