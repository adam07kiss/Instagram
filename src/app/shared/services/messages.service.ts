import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Message } from '../models/Message';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  collectionName = 'Messages';

  constructor(private afs: AngularFirestore) { }

  create(message: Message) {
    message.id = this.afs.createId();
    return this.afs.collection<Message>(this.collectionName).doc(message.id).set(message);
  }

  getAll() {
    return this.afs.collection<Message>(this.collectionName).valueChanges();
  }

  update(message: Message) {
    return this.afs.collection<Message>(this.collectionName).doc(message.id).set(message);
  }

  delete(message: Message) {
    return this.afs.collection<Message>(this.collectionName).doc(message.id).delete();
  }

  getMessagesByImageId(imageId: string) {
    return this.afs.collection<Message>(this.collectionName, ref => ref.where('imageId', '==', imageId).orderBy('date', 'asc')).valueChanges();
  }
}
