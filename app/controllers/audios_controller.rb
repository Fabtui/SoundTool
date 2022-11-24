class AudiosController < ApplicationController
  def index
    @audios = Audio.all
  end

  def new
    @audio = Audio.new
  end

  def create
    content = set_audio["url"]
    audio = Audio.new
    audio.title = Time.now.strftime("%v")
    audio.content = content
    audio.save
    redirect_to audios_path
  end

  def destroy
    audio = Audio.find(params[:id])
    audio.destroy
    redirect_to audios_path
  end


  private

  def set_audio
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
