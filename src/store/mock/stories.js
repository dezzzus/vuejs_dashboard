export default [
  {
    id: '001',
    full_url: 'http://google.com',
    image_url: 'https://images.pexels.com/photos/722397/pexels-photo-722397.jpeg?w=940&h=650&auto=compress&cs=tinysrgb',
    title: 'Title of the article',
    seconds_since_published: 30,
    channels: {
      push: {
        matching_count: 999,
        status: 'suggested'
      },
      fbm: {
        matching_count: 999,
        status: 'pending'
      },
      browser: {
        matching_count: 999,
        status: 'suggested'
      }
    }
  },
  {
    id: '002',
    full_url: 'http://google.com',
    image_url: 'https://images.pexels.com/photos/720337/pexels-photo-720337.jpeg?w=940&h=650&auto=compress&cs=tinysrgb',
    title: 'Title of the article 2',
    seconds_since_published: 1080,
    channels: {
      push: {
        matching_count: 999,
        status: 'suggested'
      },
      fbm: {
        matching_count: 1999,
        status: 'sent'
      },
      browser: {
        matching_count: 999,
        status: 'sent'
      }
    }
  },
  {
    id: '003',
    full_url: 'http://google.com',
    image_url: 'https://images.pexels.com/photos/213840/pexels-photo-213840.jpeg?w=940&h=650&auto=compress&cs=tinysrgb',
    title: 'Title of another one article',
    seconds_since_published: 12240,
    channels: {
      push: {
        matching_count: 339,
        status: 'suggested'
      },
      fbm: {
        matching_count: 999,
        status: 'suggested'
      },
      browser: {
        matching_count: 999,
        status: 'suggested'
      }
    }
  }
]
