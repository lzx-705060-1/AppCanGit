
/**
 * ArrayList like java.util.ArrayList
 */
function ArrayList(){
    this.instance = new Array();
}

ArrayList.prototype.size = function(){
    return this.instance.length;
}
/**
 * 在末尾追加一个
 */
ArrayList.prototype.add = function(o){
    this.instance[this.instance.length] = o;
}
/**
 * 当list中不存在该对象时才添加
 */
ArrayList.prototype.addSingle = function(o){
    if(!this.contains(o)){
        this.instance[this.instance.length] = o;
    }
}
/**
 * 在指定位置增加元素
 * @param posation 位置， 从0开始
 * @param o 要增加的元素
 */
ArrayList.prototype.addAt = function(position, o){
    if(position >= this.size() || position < 0 || this.isEmpty()){
        this.add(o);
        return;
    }
    
    this.instance.splice(position, 0, o);
}

/**
 * Appends all of the elements in the specified Collection to the end of
 * this list, in the order that they are returned by the
 * specified Collection's Iterator.  The behavior of this operation is
 * undefined if the specified Collection is modified while the operation
 * is in progress.  (This implies that the behavior of this call is
 * undefined if the specified Collection is this list, and this
 * list is nonempty.)
 */
ArrayList.prototype.addAll = function(array){
    if(!array || array.length < 1){
        return;
    }
    
    this.instance = this.instance.concat(array);
}

/**
 * 追加一个List在队尾
 */
ArrayList.prototype.addList = function(list){
    if(list && list instanceof ArrayList && !list.isEmpty()){
        this.instance = this.instance.concat(list.instance);
    }
}

/**
 * @return the element at the specified position in this list.
 */
ArrayList.prototype.get = function(index){
    if(this.isEmpty()){
        return null;
    }

    if(index > this.size()){
        return null;
    }

    return this.instance[index];
}

/**
 * 最后一个
 */
ArrayList.prototype.getLast = function(){
    if(this.size() < 1){
        return null;
    }

    return this.instance[this.size() - 1];
}

/**
 * Replace the element at the specified position in the list with the specified element
 * @param index int index of element to replace
 * @param obj Object element to be stored at the specified posotion
 * @return Object the element previously at the specified posotion
 * @throws IndexOutOfBoundException if index out of range
 */
ArrayList.prototype.set = function(index, obj){
    if(index >= this.size()){
        throw "IndexOutOfBoundException : Index " + index + ", Size "+this.size();
    }
    
    var oldValue = this.instance[index];
    this.instance[index] = obj;
    
    return oldValue;
}

/**
 * Removes the element at the specified position in this list.
 * Shifts any subsequent elements to the left (subtracts one from their
 * indices).
 */
ArrayList.prototype.removeElementAt = function(index){
    if(index > this.size() || index < 0){
        return;
    }

    this.instance.splice(index, 1);
}
/**
 * Removes the element in this list.
 */
ArrayList.prototype.remove = function(o){
    var index = this.indexOf(o);
    this.removeElementAt(index);
}
/**
 * @return <tt>true</tt> if this list contains the specified element.
 */
ArrayList.prototype.contains = function(o, comparatorProperies){
    return this.indexOf(o, comparatorProperies) > -1;
}
/**
 * Searches for the first occurence of the given argument, testing 
 * for equality using the <tt>==</tt> method. 
 */
ArrayList.prototype.indexOf = function(o, comparatorProperies){
    for(var i = 0; i < this.size(); i++){
        var s = this.instance[i];
        if(s == o){
            return i;
        }
        else if(comparatorProperies != null && s != null && o != null && s[comparatorProperies] == o[comparatorProperies]){
            return i;
        }
    }

    return -1;
}
/**
 * Returns the index of the last occurrence of the specified object in this list. 
 * @return the index of the last occurrence of the specified object in this list;
 *         returns -1 if the object is not found. 
 */
ArrayList.prototype.lastIndexOf = function(o, comparatorProperies){
    for(var i = this.size() - 1; i >= 0; i--){
        var s = this.instance[i];
        if(s == o){
            return i;
        }
        else if(comparatorProperies != null && s != null && o != null && s[comparatorProperies] == o[comparatorProperies]){
            return i;
        }
    }

    return -1;
}

/**
 * Returns a view of the portion of this list between 
 * fromIndex, inclusive, and toIndex, exclusive.
 * @return a view of the specified range within this list. 
 */
ArrayList.prototype.subList = function(fromIndex, toIndex){
    if(fromIndex < 0){
        fromIndex = 0;
    }
    
    if(toIndex > this.size()){
        toIndex = this.size();
    }
    
    var tempArray = this.instance.slice(fromIndex, toIndex);
    
    var temp = new ArrayList();
    temp.addAll(tempArray);
    
    return temp;
}
/**
 * Returns an array containing all of the elements in this list in the correct order;
 *
 * @return Array
 */
ArrayList.prototype.toArray = function(){
    return this.instance;
}

/**
 * Tests if this list has no elements.
 *
 * @return <tt>true</tt> if this list has no elements;
 */
ArrayList.prototype.isEmpty = function(){
    return this.size() == 0;
}
/**
 * Removes all of the elements from this list.  The list will
 * be empty after this call returns.
 */
ArrayList.prototype.clear = function(){
    this.instance = new Array();
}
/** 
 * show all elements
 */
ArrayList.prototype.toString = function(sep){
    sep = sep || ", ";
    return this.instance.join(sep);
}