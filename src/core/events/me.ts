import { Guess } from 'src/core'
import { PlayerEvent, isPlayerWonEvent } from './player'
import { Event } from './event'
import { players } from 'src/core/di'
import { Notes } from 'src/models'


/**
 * This is more of an extension of player events.
 * These events have to do with just players.me 
 */


//
// events
// ======


export interface WordEvent extends PlayerEvent {
  type: 'picked_word' | 'submit_guess'
  word: string
}

export interface PickedWordEvent extends WordEvent {
  type: 'picked_word'
}

export interface SubmitGuessEvent extends WordEvent {
  type: 'submit_guess'
  id: string
}

export interface NotesEvent extends PlayerEvent {
  type: 'notes_change'
  notes: Notes
}


//
// factories
// =========


export function createPickedWord(word: string): PickedWordEvent {
  return {
    domain: 'player',
    type: 'picked_word',
    player: players.me,
    word,
    timestamp: Date.now()
  }
}

export function createSubmitGuess(guess: Guess): SubmitGuessEvent {
  return {
    domain: 'player',
    type: 'submit_guess',
    player: players.me,
    word: guess.word,
    id: guess.id,
    timestamp: Date.now()
  }
}

export function createNotesEvent(notes: Notes): NotesEvent {
  return {
    domain: 'player',
    type: 'notes_change',
    player: players.me,
    notes,
    timestamp: Date.now()
  }
}


//
// guards
// ======


export function isWordEvent(event: Event): event is WordEvent {
  return event.domain === 'player' &&
    (event.type === 'picked_word' || event.type === 'submit_guess')
}

export function isPickWordEvent(event: Event): event is PickedWordEvent {
  return event.domain === 'player' && event.type === 'picked_word'
}

export function isMeWon(event: Event): event is PlayerEvent {
  return isPlayerWonEvent(event) && event.player === players.me
}

export function isNotesEvent(event: Event): event is NotesEvent {
  return event.domain === 'player' && event.type === 'notes_change'
}