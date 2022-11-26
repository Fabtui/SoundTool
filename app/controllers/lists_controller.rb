class ListsController < ApplicationController
  def index
    @lists = List.all
  end

  def show
    @list = List.find(params[:id])
    @items = @list.items
  end

  def create
    List.create(name: params[:name])
  end

end
