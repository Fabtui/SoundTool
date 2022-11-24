class AudiosController < ApplicationController
  def index
  end

  def new
    @audio = Audio.new
  end

  def create
    require 'base64'
    save_path = Rails.root.join("public/audio")
    unless File.exists?(save_path)
      Dir::mkdir(Rails.root.join("public/audio"))
    end
    data=params[:content]
    audio_data=Base64.decode64(data['data:audio/ogg;base64,'.length .. -1])
    File.open(save_path+"_audio.ogg", 'wb') do |f| f.write audio_data end
    Cloudinary::Uploader.upload(Rails.root.join("public/audio/_audio.ogg"), resource_type: :video, public_id: "SoundTest/audio")
  end

end
