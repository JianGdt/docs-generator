'use server';


import { revalidatePath } from 'next/cache';
import { verifySession } from '../lib/dal';
import { deleteDoc, getDocById, getUserDocs, saveDocumentation, updateDoc } from '../lib/database';

export async function saveDoc(data: {
  title: string;
  content: string;
  docType: 'readme' | 'api' | 'guide' | 'contributing';
}) {
  const session = await verifySession();

  try {
    const doc = await saveDocumentation({
      ...data,
      userId: session.userId,
    });

    revalidatePath('/dashboard');
    return { success: true, docId: doc._id.toString() };
  } catch (error) {
    console.error('Error saving document:', error);
    return { success: false, error: 'Failed to save document' };
  }
}

export async function fetchUserDocs() {
  const session = await verifySession();

  try {
    const docs = await getUserDocs(session.userId);
    return docs.map(doc => ({
      ...doc,
      _id: doc._id.toString(),
    }));
  } catch (error) {
    console.error('Error fetching documents:', error);
    return [];
  }
}

export async function fetchDocById(docId: string) {
  const session = await verifySession();

  try {
    const doc = await getDocById(docId, session.userId);
    if (!doc) return null;

    return {
      ...doc,
      _id: doc._id.toString(),
    };
  } catch (error) {
    console.error('Error fetching document:', error);
    return null;
  }
}

export async function updateDocument(
  docId: string,
  data: {
    title?: string;
    content?: string;
    docType?: 'readme' | 'api' | 'guide' | 'contributing';
  }
) {
  const session = await verifySession();

  try {
    const success = await updateDoc(docId, session.userId, data);
    
    if (success) {
      revalidatePath('/dashboard');
      return { success: true };
    }
    
    return { success: false, error: 'Document not found or unauthorized' };
  } catch (error) {
    console.error('Error updating document:', error);
    return { success: false, error: 'Failed to update document' };
  }
}

export async function deleteDocument(docId: string) {
  const session = await verifySession();

  try {
    const success = await deleteDoc(docId, session.userId);
    
    if (success) {
      revalidatePath('/dashboard');
      return { success: true };
    }
    
    return { success: false, error: 'Document not found or unauthorized' };
  } catch (error) {
    console.error('Error deleting document:', error);
    return { success: false, error: 'Failed to delete document' };
  }
}
