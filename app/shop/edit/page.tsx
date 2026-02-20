'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function ShopEdit() {
  const [user, setUser] = useState(null)
  const [shop, setShop] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Form states
  const [name, setName] = useState('')
  const [airportCode, setAirportCode] = useState('')
  const [address, setAddress] = useState('')
  const [contact, setContact] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [specializations, setSpecializations] = useState('')
  const [faaCerts, setFaaCerts] = useState('')
  const [description, setDescription] = useState('')
  const [photos, setPhotos] = useState([]) // New files to upload
  const [existingPhotos, setExistingPhotos] = useState([])

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || !user.email_confirmed_at) {
        router.push('/login')
        return
      }
      setUser(user)

      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .eq('owner_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error(error)
      } else if (data) {
        setShop(data)
        setName(data.name || '')
        setAirportCode(data.airport_code || '')
        setAddress(data.address || '')
        setContact(data.contact || '')
        setPhone(data.phone || '')
        setEmail(data.email || '')
        setSpecializations(data.specializations || '')
        setFaaCerts(data.faa_certs || '')
        setDescription(data.description || '')
        setExistingPhotos(data.photos || [])
      }
      setLoading(false)
    }
    getUser()
  }, [router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Upload new photos
    const uploadedPhotos = []
    for (const photo of photos) {
      const filePath = `${user.id}/${crypto.randomUUID()}.${photo.name.split('.').pop()}`
      const { error } = await supabase.storage
        .from('shop-photos')
        .upload(filePath, photo)
      if (error) {
        console.error('Upload error:', error)
        continue
      }
      const { data: { publicUrl } } = supabase.storage
        .from('shop-photos')
        .getPublicUrl(filePath)
      uploadedPhotos.push(publicUrl)
    }

    const allPhotos = [...existingPhotos, ...uploadedPhotos]

    const shopData = {
      owner_id: user.id,
      name,
      airport_code: airportCode,
      address,
      contact,
      phone,
      email,
      specializations,
      faa_certs: faaCerts,
      description,
      photos: allPhotos
    }

    let result
    if (shop) {
      result = await supabase.from('shops').update(shopData).eq('id', shop.id)
    } else {
      result = await supabase.from('shops').insert(shopData)
    }

    if (result.error) {
      console.error('Save error:', result.error)
      alert('Error saving shop')
    } else {
      alert('Shop saved successfully!')
    }
    setLoading(false)
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{shop ? 'Edit Shop' : 'Add Shop'}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Business Name"
          className="w-full p-2 border"
        />
        <input
          type="text"
          value={airportCode}
          onChange={(e) => setAirportCode(e.target.value)}
          placeholder="Airport Code"
          className="w-full p-2 border"
        />
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Address"
          className="w-full p-2 border"
        />
        <input
          type="text"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="Contact Name"
          className="w-full p-2 border"
        />
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone"
          className="w-full p-2 border"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-2 border"
        />
        <textarea
          value={specializations}
          onChange={(e) => setSpecializations(e.target.value)}
          placeholder="Specializations (comma-separated)"
          className="w-full p-2 border"
        />
        <textarea
          value={faaCerts}
          onChange={(e) => setFaaCerts(e.target.value)}
          placeholder="FAA Certifications"
          className="w-full p-2 border"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (free tier: basic info)"
          className="w-full p-2 border"
        />
        <div>
          <label>Photos:</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setPhotos(Array.from(e.target.files || []))}
            className="w-full"
          />
          <div className="flex flex-wrap mt-2">
            {existingPhotos.map((url, i) => (
              <img key={i} src={url} alt={`Photo ${i}`} className="w-24 h-24 object-cover m-1" />
            ))}
          </div>
        </div>
        <button type="submit" disabled={loading} className="bg-blue-500 text-white p-2">
          {loading ? 'Saving...' : 'Save'}
        </button>
        <p className="text-sm text-gray-500">Note: Paid tier for advanced features coming soon.</p>
      </form>
    </div>
  )
}
