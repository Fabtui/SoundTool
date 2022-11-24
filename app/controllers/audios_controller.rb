class AudiosController < ApplicationController
  def index
    @audios = Audio.all
  end

  def new
    @audio = Audio.new
  end

  def create
    cloudinary = set_audio
    audio = Audio.new
    audio.title = Time.now.strftime("%c")
    audio.content = cloudinary["url"]
    audio.public_id = cloudinary["public_id"]
    audio.save
    redirect_to audios_path
  end

  def destroy
    audio = Audio.find(params[:id])
    Cloudinary::Uploader.destroy(audio.public_id, resource_type: :video)
    audio.destroy
    redirect_to audios_path
  end

  private

  def set_audio
    require 'base64'
    save_path = Rails.root.join("public/audio")
    Dir::mkdir(Rails.root.join("public/audio")) unless File.exists?(save_path)
    data = params[:content]
    audio_data=Base64.decode64(data['data:audio/ogg;base64,'.length .. -1])
    File.open(save_path+"_audio.ogg", 'wb') do |f| f.write audio_data end
    Cloudinary::Uploader.upload(Rails.root.join("public/audio/_audio.ogg"), resource_type: :video, public_id: "SoundTest/#{Time.now.strftime("%c")}")
  end
end
