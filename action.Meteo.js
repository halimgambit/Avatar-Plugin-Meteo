'use strict';

// Ce module vérifie prépare l'objet data envoyé au plugin

Object.defineProperty(exports, "__esModule", {
  value: true
});


exports.default = function (state) {
	
	return new Promise(function (resolve, reject) {
		
		// Renvoie le client qui a exécuté la règle ou une pièce dans la règle ou une pièce mappée ou par défaut...
		let room = Avatar.ia.clientFromRule (state.rawSentence, state.client);
		
		setTimeout(function(){ 
			if (state.debug) info('Action Meteo');
			
			state.action = {
				module: 'Meteo',
				room: room,
				sentence: state.sentence,
				rawSentence: state.rawSentence,
				tags: state.tags
			};
			resolve(state);
		}, ((Config.waitAction && Config.waitAction.time) ? Config.waitAction.time : 100));	
		
	});
};



