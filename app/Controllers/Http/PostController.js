'use strict'
// bring in model
const Post = use('App/Models/Post')

// bring in validator
const { validate } = use('Validator')

class PostController {
  async index({ view }) {
    // const posts = [
    //   {title : 'post 1', body: 'ini adalah bodinya 1'},
    //   {title : 'post 2', body: 'ini adalah bodinya 2'},
    //   {title : 'post 3', body: 'ini adalah bodinya 3'},
    //   {title : 'post 4', body: 'ini adalah bodinya 4'}
    // ]
    const posts = await Post.all();
    return view.render('posts.index', {
      title : 'last post',
      posts: posts.toJSON()
    })
  }

  async detail({ view, params }) {
    const post = await Post.find(params.id)
    return view.render('posts.detail', {
      post: post
    })

  }

  async add({ view }) {
    return view.render('posts.add')
  }

  async store({ request, response, session }) {
    // validate input
    const validation = await validate(request.all(), {
      title : 'required|min:3|max:255',
      body  : 'required|min:3'
    })

    if(validation.fails()) {
      session.withErrors(validation.messages()).flashAll()
      return response.redirect('back')
    }
    const post = new Post()
    post.title = request.input('title')
    post.body = request.input('body')

    await post.save()
    session.flash({ notification: 'Post Added' })
    return response.redirect('/posts')
  }

  async edit({ params, view }) {
    const post = await Post.find(params.id)
    return view.render('posts.edit', {
      post: post
    })
  }

  async update({ params, request, response, session }) {
    // validate input
    const validation = await validate(request.all(), {
      title : 'required|min:3|max:255',
      body  : 'required|min:3'
    })

    if(validation.fails()) {
      session.withErrors(validation.messages()).flashAll()
      return response.redirect('back')
    }

    const post = await Post.find(params.id)
    post.title = request.input('title')
    post.body = request.input('body')
    await post.save()

    session.flash({ notification: 'Post Updated' })
    return response.redirect('/posts')
  }

  async destroy({ params, session, response }) {
    const post = await Post.find(params.id)

    await post.delete()
    session.flash({ notification: 'Post Deleted' })
    return response.redirect('/posts')
  }

}

module.exports = PostController
