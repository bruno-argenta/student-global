package com.myklovr.helpers;

import java.text.MessageFormat;
import java.util.ResourceBundle;

import com.myklovr.helpers.constants.RoutesConstants;

public class PropertiesHelper {
	
	private static String getMessage(String ruta, String key){
		ResourceBundle rb = ResourceBundle.getBundle(ruta);
		return rb.getString(key);
    }    
        
    public static String getStringConfigProperty (String key){
    	return getMessage(RoutesConstants.CONFIG_PROPERTIES, key);
    }
    
    public static String getStringConfigPropertyEncrypted(String key){
    	String encrypted = getStringConfigProperty(key);
    	return CryptoHelper.decryptString(encrypted);
    }
    
    public static int getIntConfigProperty (String key){
    	String value = getMessage(RoutesConstants.CONFIG_PROPERTIES, key);
    	int intValue = Integer.parseInt(value);
    	return intValue;
    }    
    
    public static String getStringMessageProperty (String key){
    	return getMessage(RoutesConstants.MESSAGE_PROPERTIES, key);
    }
    
    public static String getStringMessageProperty (String key, Object... args){
    	return MessageFormat.format(getMessage(RoutesConstants.MESSAGE_PROPERTIES, key), args);
    }

}
