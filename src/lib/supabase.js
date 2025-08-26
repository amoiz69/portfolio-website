import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper functions for common operations
export const portfolioAPI = {
  // Profile
  async getProfile() {
    const { data, error } = await supabase
      .from('profile')
      .select('*')
      .limit(1)
      .single()
    
    if (error) throw error
    return data
  },

  async updateProfile(updates) {
    const { data, error } = await supabase
      .from('profile')
      .update(updates)
      .eq('id', 1)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Projects
  async getProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async getProject(id) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async createProject(project) {
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateProject(id, updates) {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async deleteProject(id) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  },

  // Skills
  async getSkills() {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('category', { ascending: true })
      .order('display_order', { ascending: true })
    
    if (error) throw error
    return data
  },

  async createSkill(skill) {
    const { data, error } = await supabase
      .from('skills')
      .insert(skill)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Blog Posts
  async getBlogPosts() {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async getBlogPost(slug) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single()
    
    if (error) throw error
    return data
  },

  // Contact
  async sendContactMessage(message) {
    const { data, error } = await supabase
      .from('contact_messages')
      .insert(message)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Storage
  async uploadImage(file, path) {
    const { data, error } = await supabase.storage
      .from('portfolio-images')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      })
    
    if (error) throw error
    return data
  },

  async getImageUrl(path) {
    const { data } = supabase.storage
      .from('portfolio-images')
      .getPublicUrl(path)
    
    return data.publicUrl
  }
}

export default portfolioAPI
