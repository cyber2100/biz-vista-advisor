import { supabase, Business, BusinessDocument } from '@/lib/supabase';
import { StorageError } from '@supabase/storage-js';

export async function createBusiness(businessData: Omit<Business, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const { data, error } = await supabase
      .from('businesses')
      .insert([businessData])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating business:', error);
    return { data: null, error };
  }
}

export async function getBusinessByUserId(userId: string) {
  try {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned" error
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching business:', error);
    return { data: null, error };
  }
}

export async function updateBusiness(id: string, businessData: Partial<Business>) {
  try {
    const { data, error } = await supabase
      .from('businesses')
      .update(businessData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating business:', error);
    return { data: null, error };
  }
}

export async function uploadBusinessDocument(
  businessId: string,
  file: File
): Promise<{ data: BusinessDocument | null; error: Error | StorageError | null }> {
  try {
    // 1. Upload the file to storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `business_documents/${businessId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // 2. Create a record in the business_documents table
    const { data, error: dbError } = await supabase
      .from('business_documents')
      .insert([
        {
          business_id: businessId,
          file_name: file.name,
          file_type: file.type,
          file_path: filePath,
        },
      ])
      .select()
      .single();

    if (dbError) throw dbError;
    return { data, error: null };
  } catch (error) {
    console.error('Error uploading document:', error);
    return { data: null, error: error as Error | StorageError };
  }
}

export async function getBusinessDocuments(businessId: string) {
  try {
    const { data, error } = await supabase
      .from('business_documents')
      .select('*')
      .eq('business_id', businessId)
      .order('uploaded_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching business documents:', error);
    return { data: null, error };
  }
}

export async function getDocumentUrl(filePath: string) {
  try {
    const { data, error } = await supabase.storage
      .from('documents')
      .createSignedUrl(filePath, 60); // 60 seconds expiry

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error getting document URL:', error);
    return { data: null, error };
  }
}

export async function deleteDocument(id: string, filePath: string) {
  try {
    // 1. Delete the file from storage
    const { error: storageError } = await supabase.storage
      .from('documents')
      .remove([filePath]);

    if (storageError) throw storageError;

    // 2. Delete the record from the database
    const { error: dbError } = await supabase
      .from('business_documents')
      .delete()
      .eq('id', id);

    if (dbError) throw dbError;
    return { error: null };
  } catch (error) {
    console.error('Error deleting document:', error);
    return { error };
  }
}