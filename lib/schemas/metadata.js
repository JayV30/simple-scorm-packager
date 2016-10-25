var EOL = '\n';
var vcard = function(data, exclude) {
	var exclude = exclude || {};
	var card = 'BEGIN:VCARD' + EOL;
	card += 'VERSION:2.1' + EOL;
	if (data) {
		if (data.author) card += 'FN:' + data.author + EOL;
		if (data.version && !exclude.version) card += 'NOTE:version ' + data.version + ' ' + EOL;
		if (data.org && !exclude.org) card += 'ORG:' + data.org + EOL;
		if (data.tel && !exclude.tel && data.tel.length > 0) card += 'TEL;WORK;VOICE:' + data.tel.join(';') + EOL;
		if (data.address && !exclude.address && data.address.length > 0) card += 'ADR;WORK:;;' + data.address.join(';') + EOL;
		if (data.mail && !exclude.mail && data.mail.length > 0) card += 'EMAIL;PREF;INTERNET:' + data.mail.join(';') + EOL;
		if (data.url && !exclude.url) card += 'URL:' + data.url + EOL;
	}
	card += 'END:VCARD';
	return card;
}

var vrequirements = function(data) {
	let arr = [];
	if (data.length) {
		for (var k = 0, n = data.length; k < n; k += 1) {
			var dataBlock = data[k];
			if (dataBlock['type'] && dataBlock['name']) {
				var block = {
					type: {
						source: {
							'#text': 'LOMv1.0'
						},
						value: {
							'#cdata': dataBlock.type
						}
					},
					name: {
						source: {
							'#text': 'LOMv1.0'
						},
						value: {
							'#cdata': dataBlock.name
						}
					},
					minimumversion: {
						'#cdata': dataBlock.version || ''
					}
				}
				arr.push(block);
			}
		}
	}
	return arr;
}

var keywords = function(data, lng) {
	let arr = [];
	for (var k = 0, n = data.length; k < n; k += 1) {
		arr.push({
			string: {
				'@language': lng,
				'#cdata': data[k]
			}
		});
	}
	return arr;
}

module.exports = function(obj) {
	var
		name = obj.package.name, //obj.package.name.replace(/ /g, '_'),
		identifier = obj.title.replace(/ /g, '.'),
		itemIdentifier = 'item_' + obj.identifier.replace(/ /g, ''),
		identifierref = 'resource_' + obj.identifier.replace(/ /g, ''),
		organization = obj.organization.replace(/ /g, '_');
	return {
		'@xmlns': 'http://ltsc.ieee.org/xsd/LOM',
		'@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
		'@xmlns:pkgprop': 'http://www.scorm.com/xsd/ScormEnginePackageProperties',
		'@xsi:schemaLocation': 'http://ltsc.ieee.org/xsd/LOM lomLoose.xsd http://www.scorm.com/xsd/ ' + '\n' +
			'ScormEnginePackageProperties ScormEnginePackageProperties.xsd',
		metametadata: {
			metadataSchema: ['LOMv1.0', 'ADL SCORM ' + obj.version],
			identifier: {
				catalog: 'URI',
				entry: identifier
			},
			language: {
				'#text': obj.language
			},
			contribute: {
				role: {
					source: {
						'#text': 'LOMv1.0'
					},
					value: {
						'#text': 'creator'
					}
				},
				entity: {
					'#cdata': vcard(obj.package.vcard, {
						'version': true
					}),
				},
				date: {
					dateTime: obj.package.date,
					description: {
						'@language': obj.language,
						'#cdata': obj.package.timestamp
					}
				}
			}
		},
		general: {
			identifier: {
				catalog: 'URI',
				entry: identifier
			},
			title: {
				'@language': obj.language,
				'#text': name
			},
			language: {
				'#text': obj.language
			},
			description: {
				string: {
					'@language': obj.language,
					'#cdata': obj.package.description
				}
			},
			keyword: keywords(obj.package.keywords, obj.language)
		},
		lifeCycle: {
			version: {
				string: {
					'@language': obj.language,
					'#text': obj.package.version
				}
			},
			status: {
				source: 'LOMv1.0',
				value: obj.package.status
			},
			contribute: [{
				entity: {
					'#cdata': vcard(obj.package.vcard, {
						'version': true
					}),
				},
				date: {
					dateTime: obj.package.date,
					description: {
						'@language': obj.language,
						'#cdata': obj.package.timestamp
					}
				}
			}, {
				role: {
					source: {
						'#text': 'LOMv1.0'
					},
					value: {
						'#text': 'author'
					}
				},
				entity: {
					'#cdata': vcard(obj.package.vcard, {
						'version': true
					}),
				},
				date: {
					dateTime: obj.package.date,
					description: {
						'@language': obj.language,
						'#cdata': obj.package.timestamp
					}
				}
			}, {
				role: {
					source: {
						'#text': 'LOMv1.0'
					},
					value: {
						'#text': 'publisher'
					}
				},
				entity: {
					'#cdata': vcard(obj.package.vcard),
				},
				date: {
					dateTime: obj.package.date,
					description: {
						'@language': obj.language,
						'#cdata': obj.package.timestamp
					}
				}
			}, {
				role: {
					source: {
						'#text': 'LOMv1.0'
					},
					value: {
						'#text': 'technical implementer'
					}
				},
				entity: {
					'#cdata': vcard(obj.package.vcard, {
						'version': true
					}),
				},
				date: {
					dateTime: obj.package.date,
					description: {
						'@language': obj.language,
						'#cdata': obj.package.timestamp
					}
				}
			}]
		},
		technical: {
			'format': ['text/html', 'application/x-javascript', 'text/css'],
			size: obj.package.size,
			location: obj.startingPage,
			requirement: vrequirements(obj.package.requirements),
			duration: {
				duration: obj.package.duration,
				description: {
					string: {
						'@language': obj.language,
						'#cdata': 'Le temps qu\'il faudra pour regarder l\'ensemble du module du début à la fin.'
					}
				}
			},
			'pkgprop:ScormEnginePackageProperties':  {
				'@xmlns': 'http://www.scorm.com/xsd/ScormEnginePackageProperties',
				appearence: {
					displayStage:  {
						desired: {
							width: 1280,
							height: 720,
							fullscreen: 'yes'
						},
						required: {
							width: 640,
							height: 480,
							fullscreen: 'no'
						}
					}
				},
				behavior: {
					alwaysFlowToFirstSco: 'yes',
					rollupEmptySetToUnknown: 'yes'
				}
			}
		},
		educational: {
			typicalLearningTime: {
				duration: obj.package.typicalDuration,
				description: {
					string: {
						'@language': obj.language,
						'#cdata': 'Le temps moyen pour un apprenant pour terminer ce cours.'
					}
				}
			},
			description: {
				string: {
					'#cdata': obj.package.educational
				}
			},
			language: {
				'#text': obj.language
			}
		},
		rights: {
			copyrightAndOtherRestrictions: {
				source: 'LOMv1.0',
				value: 'no'
			},
			description: {
				string: {
					'@language': obj.language,
					'#cdata': obj.package.rights
				}
			}
		}
	}
}