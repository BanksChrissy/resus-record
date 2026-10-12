import {getDiagnosticPathway, diagnosticsUpdated} from './diagnostics-data.mjs';

// Reviewing a reference supplies provenance only. Clinical assertions stay blank.
export function diagnosticAssessmentSeed(pathwayId) {
  const pathway = getDiagnosticPathway(pathwayId);
  if (!pathway) return null;
  return {
    'Pathway reviewed': pathway.title,
    'Assessment status': 'Not assessed',
    'Reference version': `Diagnostics reference ${diagnosticsUpdated}`
  };
}

export const diagnosticAssessmentFields = [
  {label:'Pathway reviewed', type:'text'},
  {label:'Assessment status', type:'select', options:['Not assessed','Considering','Suspected','Supported by findings','Confirmed by appropriate assessment / testing','Less likely','Unresolved']},
  {label:'Working diagnosis / physiological problem', type:'text'},
  {label:'Supporting findings', type:'textarea'},
  {label:'Conflicting findings / important alternatives', type:'textarea'},
  {label:'Not assessed / examination limits', type:'textarea'},
  {label:'Tests planned / pending', type:'textarea'},
  {label:'Results / interpretation', type:'textarea'},
  {label:'Immediate care planned', type:'textarea'},
  {label:'Definitive care / destination', type:'textarea'},
  {label:'Reference version', type:'text'}
];
