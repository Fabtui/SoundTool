Rails.application.routes.draw do
  root to: "pages#home"
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html
  resources :audios
  resources :lists do
    resources :items, only: [:create]
  end
  get '/test', to: 'pages#test'
  # Defines the root path route ("/")
  # root "articles#index"
end
