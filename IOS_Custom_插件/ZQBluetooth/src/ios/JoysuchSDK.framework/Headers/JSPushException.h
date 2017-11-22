//
//  JSPushException.h
//  JoysuchSDK
//
//  Created by seekcy on 2017/1/23.
//  Copyright © 2017年 com.joysuch. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface JSPushException : NSObject

@property (nonatomic) int errorCode;
@property (nonatomic, strong) NSString *errorMsg;

@end
